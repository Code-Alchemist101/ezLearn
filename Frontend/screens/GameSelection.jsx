import React from 'react';
import { View } from 'react-native';
import { GameSelectionScreenStyles } from '../styles';
import Chess_icon_component from '../UI/Chess_icon';
import Poker_icon_component from '../UI/Poker_icon';
import Guitar_icon_component from '../UI/Guitar_icon';

const GameSelection = ({ navigation }) => {
  return (
    <View style={GameSelectionScreenStyles.container}>
      <View style={GameSelectionScreenStyles.row}>
        <Chess_icon_component navigation={navigation} />
        <Poker_icon_component navigation={navigation} />
      </View>
      <View style={GameSelectionScreenStyles.bottomCenter}>
        <Guitar_icon_component navigation={navigation} />
      </View>
    </View>
  );
};

export default GameSelection;
