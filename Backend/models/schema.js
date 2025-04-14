import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: null },
  ytLink: { type: [String], required: true },
  ytSummary: { type: String, default: null },
  completed: { type: Boolean, default: false }
});

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modules: [moduleSchema]
});

const levelSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true
  },
  topics: [topicSchema] 
});

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  levels: [levelSchema]
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  totalXP: { type: Number, default: 0 },
  games: [gameSchema]
});

const User = mongoose.model('User', userSchema);
export default User;