import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from './util/mongodb.js';
import User from './models/schema.js'; 
import presets from './models/presets.js'; 
import { generateAIContent } from "./util/gemini.js";
import { summarizeYoutubeVideo } from "./util/summary_generator.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 3000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/createOrfetchUser', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).send('Username is required');

    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username });
            await user.save();
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.post("/gameSelection", async (req, res) => {
    const { username, gameName } = req.body;
    if (!username || !gameName) return res.status(400).send('Missing username or game');

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('User not found');

        const existingGame = user.games.find(game => game.name === gameName);
        if (existingGame) {
            return res.status(200).json({ message: `Game '${gameName}' already selected.`, user });
        }

        user.games.push({ name: gameName, levels: [] });
        await user.save();

        res.status(200).json({ message: `Game '${gameName}' added successfully.`, user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.post("/levelSelection", async (req, res) => {
    const { username, gameName, level } = req.body;
    if (!username || !gameName || !level) return res.status(400).send('Missing username, game, or level');

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('User not found');

        const game = user.games.find(game => game.name === gameName);
        if (!game) return res.status(404).send(`Game '${gameName}' not found for user.`);

        const existingLevel = game.levels.find(lvl => lvl.level === level);
        if (existingLevel) {
            return res.status(200).json({
                message: `Level '${level}' already exists for game '${gameName}'.`,
                level: existingLevel
            });
        }

        const levelTopics = presets[gameName]?.levels?.[level];
        if (!levelTopics) {
            return res.status(404).json({ error: `Topics for level '${level}' in game '${gameName}' not found.` });
        }

        const processedTopics = [];

        for (const topic of levelTopics) {
            const processedModules = [];

            for (const module of topic.modules) {
                await delay(20000);

                let content = "Content generation failed.";
                let ytSummary = null;

                try {
                    const response = await generateAIContent(
                        `Give a short and simple 2-3 sentence overview of the topic "${topic.name}" and its sub-module "${module.title}". Keep it beginner-friendly and concise.`
                    );
                    content = response.replace(/\n/g, ' ').replace(/\\/g, '').trim();
                } catch {}

                if (Array.isArray(module.ytLink) && module.ytLink.length > 0) {
                    try {
                        ytSummary = await summarizeYoutubeVideo(module.ytLink[0]);
                    } catch {
                        ytSummary = "Failed to fetch summary.";
                    }
                }

                processedModules.push({
                    title: module.title,
                    ytLink: module.ytLink,
                    content,
                    ytSummary
                });
            }

            processedTopics.push({
                name: topic.name,
                modules: processedModules
            });
        }

        game.levels.push({ level, topics: processedTopics });
        await user.save();

        res.status(200).json({
            success: true,
            message: `Level '${level}' added successfully to game '${gameName}'.`,
            level: { level, topics: processedTopics }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process level selection', details: err.message });
    }
});

app.post("/completeModule", async (req, res) => {
    const { username, gameName, level, topicName, moduleTitle } = req.body;
    
    if (!username || !gameName || !level || !topicName || !moduleTitle) {
      return res.status(400).send('Missing required fields');
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).send('User not found');
  
      const game = user.games.find(g => g.name === gameName);
      if (!game) return res.status(404).send('Game not found');
  
      const levelObj = game.levels.find(l => l.level === level);
      if (!levelObj) return res.status(404).send('Level not found');
  
      const topic = levelObj.topics.find(t => t.name === topicName);
      if (!topic) return res.status(404).send('Topic not found');
  
      const module = topic.modules.find(m => m.title === moduleTitle);
      if (!module) return res.status(404).send('Module not found');
  
      if (module.completed) {
        return res.status(200).json({ 
          message: 'Module already completed', 
          xpEarned: 0,
          totalXP: user.totalXP
        });
      }
  
      module.completed = true;
      
      let xpEarned = 0;
      switch(level) {
        case 'Beginner':
          xpEarned = 10;
          break;
        case 'Intermediate':
          xpEarned = 20;
          break;
        case 'Advanced':
          xpEarned = 30;
          break;
        default:
          xpEarned = 10;
      }
      
      user.totalXP += xpEarned;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Module completed successfully',
        xpEarned,
        totalXP: user.totalXP
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
});

app.get('/getUserProgress', async (req, res) => {
    const { username, gameName, level } = req.query;
    
    if (!username || !gameName || !level) {
      return res.status(400).send('Missing required fields');
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).send('User not found');
  
      const game = user.games.find(g => g.name === gameName);
      if (!game) return res.status(404).send('Game not found');
  
      const levelObj = game.levels.find(l => l.level === level);
      if (!levelObj) return res.status(404).send('Level not found');
  
      res.status(200).json({
        totalXP: user.totalXP,
        topics: levelObj.topics
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
