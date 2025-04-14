import React from 'react';
import { Pressable, Text, View, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import { GameSelectionScreenStyles } from '../styles';

const Poker_icon_component = ({ navigation }) => {
  const handlePokerClicked = async () => {
    try {
      console.log("Poker selected");
      Alert.alert(
        "Coming Soon",
        "Currently, this app supports only Chess. Poker will be added soon.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    } catch (error) {
      console.error("Error selecting Poker game:", error);
    }
  };

  return (
    <Pressable onPress={handlePokerClicked} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      <View style={GameSelectionScreenStyles.iconWrapper}>
        <Avatar.Image size={80} source={require('../images/poker.png')} />
        <Text style={GameSelectionScreenStyles.iconLabel}>Poker</Text>
      </View>
    </Pressable>
  );
};

export default Poker_icon_component;
