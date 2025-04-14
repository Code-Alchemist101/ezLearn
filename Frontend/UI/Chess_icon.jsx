import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { GameSelectionScreenStyles } from '../styles';
import api from '../router/routes';

const Chess_icon_component = ({ navigation }) => {
  const handleChessClicked = async () => {
    console.log("Chess selected");

    try {
      const response = await api.selectGame("Chess");
      console.log("Game selection response:", response.message);

      navigation.navigate('LevelSelection');
    } catch (error) {
      console.error("Failed to select game:", error);
    }
  };

  return (
    <Pressable onPress={handleChessClicked} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      <View style={GameSelectionScreenStyles.iconWrapper}>
        <Avatar.Image size={80} source={require('../images/chess.png')} />
        <Text style={GameSelectionScreenStyles.iconLabel}>Chess</Text>
      </View>
    </Pressable>
  );
};

export default Chess_icon_component;
