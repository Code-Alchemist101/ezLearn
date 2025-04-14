import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import ModalComp from '../UI/Modal_Comp';
import { LearningScreenStyles } from '../styles';
import XPBar from '../UI/XPBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../router/routes';

const LearningScreen = ({ route }) => {
  const { topics } = route.params;
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUserProgress = async () => {
      try {
        setLoading(true);
        await api.getUserProgress();
        
        const xp = await AsyncStorage.getItem('totalXP');
        if (xp) {
          setTotalXP(parseInt(xp, 10));
        } else {
          setTotalXP(0);
        }
      } catch (error) {
        console.error('Error syncing user progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    syncUserProgress();
  }, []);

  const handleXPUpdate = async (newXP) => {
    setTotalXP(newXP);
    try {
      await AsyncStorage.setItem('totalXP', newXP.toString());
    } catch (error) {
      console.error('Error saving XP:', error);
    }
  };

  const handlePlayChess = () => {
    Linking.openURL('https://www.chess.com/play');
  };

  if (loading) {
    return (
      <View style={[LearningScreenStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <View style={LearningScreenStyles.container}>
      <XPBar 
        currentXP={totalXP} 
        style={LearningScreenStyles.xpBar}
      />
      
      <ScrollView contentContainerStyle={LearningScreenStyles.scrollContainer}>
        {topics.map((topic, index) => (
          <ModalComp 
            key={index} 
            topic={topic} 
            onXPUpdate={handleXPUpdate}
          />
        ))}

        <View style={LearningScreenStyles.chessContainer}>
          <Text style={LearningScreenStyles.chessText}>Challenge your mind with a game of Chess!</Text>
          <Pressable style={LearningScreenStyles.chessButton} onPress={handlePlayChess}>
            <Text style={LearningScreenStyles.buttonText}>Play Chess Online</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default LearningScreen;