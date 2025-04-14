import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://ezlearn-production.up.railway.app/',
  withCredentials: true, 
});

const api = {
  createOrFetchUser: async (username) => {
    try {
      const response = await axiosInstance.post('/createOrfetchUser', { username });
      await AsyncStorage.setItem('username', response.data.username);
      return response.data;
    } catch (error) {
      console.error('Error creating/fetching user:', error);
      throw error;
    }
  },

  selectGame: async (gameName) => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) throw new Error('Username not found in AsyncStorage');
      const response = await axiosInstance.post('/gameSelection', { gameName, username });
      await AsyncStorage.setItem('gameName', gameName);
      return response.data;
    } catch (error) {
      console.error('Error selecting game:', error);
      throw error;
    }
  },  

  selectLevel: async (gameName, level) => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) throw new Error('Username not found in AsyncStorage');
      const response = await axiosInstance.post('/levelSelection', { username, gameName, level });
      await AsyncStorage.setItem('level', level);
      return response.data;
    } catch (error) {
      console.error('Error selecting level:', error);
      throw error;
    }
  },

  completeModule: async (gameName, level, topicName, moduleTitle) => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) throw new Error('Username not found in AsyncStorage');
      const response = await axiosInstance.post('/completeModule', {
        username,
        gameName,
        level,
        topicName,
        moduleTitle
      });
      return response.data;
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    }
  },

  getUserProgress: async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const gameName = await AsyncStorage.getItem('gameName');
      const level = await AsyncStorage.getItem('level');
      if (!username || !gameName || !level) throw new Error('Missing user information');
      const response = await axiosInstance.get('/getUserProgress', {
        params: { username, gameName, level }
      });
      await AsyncStorage.setItem('totalXP', response.data.totalXP.toString());
      for (const topic of response.data.topics) {
        const completedModules = {};
        for (const module of topic.modules) {
          completedModules[module.title] = module.completed ? true : false;
        }
        const key = `completed_${topic.name}`;
        await AsyncStorage.setItem(key, JSON.stringify(completedModules));
      }
      return response.data;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }
};

export default api;
