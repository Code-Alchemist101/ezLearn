import React from 'react';
import { Pressable, Text, View, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import { GameSelectionScreenStyles } from '../styles';

const Guitar_icon_component = ({ navigation }) => {
  const handleGuitarClicked = async () => {
    try {
      console.log("Guitar selected");
      Alert.alert(
        "Coming Soon",
        "Currently, this app supports only Chess. Guitar will be added soon.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    } catch (error) {
      console.error("Error selecting Guitar game:", error);
    }
  };

  return (
    <Pressable onPress={handleGuitarClicked} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      <View style={GameSelectionScreenStyles.iconWrapper}>
        <Avatar.Image size={80} source={require('../images/guitar.png')} />
        <Text style={GameSelectionScreenStyles.iconLabel}>Guitar</Text>
      </View>
    </Pressable>
  );
};

export default Guitar_icon_component;
