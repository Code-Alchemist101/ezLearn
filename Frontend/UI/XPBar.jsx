import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { XPBarStyles } from '../styles';

const XPBar = ({ currentXP, style }) => {
  const getLevelInfo = (xp) => {
    const levels = [
      { threshold: 0, name: "Novice" },
      { threshold: 50, name: "Apprentice" },
      { threshold: 100, name: "Student" },
      { threshold: 200, name: "Scholar" },
      { threshold: 300, name: "Expert" },
      { threshold: 500, name: "Master" },
      { threshold: 1000, name: "Grandmaster" }
    ];
    
    let currentLevel = levels[0];
    let nextLevel = levels[1];
    
    for (let i = 0; i < levels.length - 1; i++) {
      if (xp >= levels[i].threshold && xp < levels[i+1].threshold) {
        currentLevel = levels[i];
        nextLevel = levels[i+1];
        break;
      } else if (i === levels.length - 2 && xp >= levels[i+1].threshold) {
        currentLevel = levels[i+1];
        nextLevel = null;
      }
    }
    
    let progress = 1;
    if (nextLevel) {
      const levelXP = xp - currentLevel.threshold;
      const levelRange = nextLevel.threshold - currentLevel.threshold;
      progress = Math.min(levelXP / levelRange, 1);
    }
    
    return { 
      currentLevel: currentLevel.name,
      progress,
      nextLevelXP: nextLevel ? nextLevel.threshold : null
    };
  };
  
  const { currentLevel, progress, nextLevelXP } = getLevelInfo(currentXP);
  
  return (
    <View style={[XPBarStyles.container, style]}>
      <View style={XPBarStyles.headerRow}>
        <Text style={XPBarStyles.levelText}>{currentLevel}</Text>
        <Text style={XPBarStyles.xpText}>{currentXP} XP</Text>
      </View>
      
      <View style={XPBarStyles.barContainer}>
        <LinearGradient
          colors={['#4CAF50', '#8BC34A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[XPBarStyles.progressBar, { width: `${progress * 100}%` }]}
        />
      </View>
      
      {nextLevelXP && (
        <Text style={XPBarStyles.nextLevelText}>
          {nextLevelXP - currentXP} XP to next level
        </Text>
      )}
    </View>
  );
};

export default XPBar;