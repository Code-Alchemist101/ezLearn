import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import GameSelection from './screens/GameSelection';
import LevelSelection from './screens/LevelSelection';
import LearningScreen from './screens/LearningScreen';

const Stack = createNativeStackNavigator();

const YourApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="GameSelection" 
          component={GameSelection} 
          options={{ title: 'Select a Game' }}
        />
        <Stack.Screen 
            name="LevelSelection" 
            component={LevelSelection} 
            options={{ title: 'Choose a Level' }} 
        />
        <Stack.Screen 
            name="LearningScreen" 
            component={LearningScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default YourApp;
