import { YoutubeTranscript } from 'youtube-transcript';
import { generateAIContent } from './gemini.js';

export async function summarizeYoutubeVideo(youtubeUrl) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl);

    if (!transcript || transcript.length === 0) {
      console.warn("⚠️ No transcript available.");
      return "No transcript available for this video.";
    }

    const fullText = transcript.map(chunk => chunk.text).join(' ');

    const prompt = `
      Here is a YouTube video transcript. Generate a short, clear summary of the main content and ideas.
      Keep the summary brief — no more than 4-5 sentences.

      Transcript:
      ${fullText}
    `;

    const summary = await generateAIContent(prompt);

    return summary.replace(/\\n/g, "\n").replace(/\\+/g, "").trim();
  } catch (err) {
    console.error("❌ Error in summarizeYoutubeVideo:", err.message);
    return "Summary generation failed. Try again with a valid YouTube link.";
  }
}
