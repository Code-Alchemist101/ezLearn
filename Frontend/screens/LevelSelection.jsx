import React, { Component } from 'react';
import { Pressable, View, Alert, ActivityIndicator, Animated } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { LevelSelectionScreenStyles } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../router/routes';

export default class LevelSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topics: [],
    };
  }

  handleLevelClick = async (level) => {
    try {
      this.setState({ loading: true });
      console.log(level);

      const gameName = await AsyncStorage.getItem('gameName');
      console.log(gameName);

      if (!gameName) {
        Alert.alert('Error', 'No game selected. Please select a game first.');
        this.setState({ loading: false });
        return;
      }

      const response = await api.selectLevel(gameName, level);
      console.log('Level stored:', response);

      const topics = response.level.topics;
      this.setState({ topics, loading: false }, () => {
        this.props.navigation.navigate('LearningScreen', { topics });
      });
    } catch (error) {
      console.error('Error in level selection:', error);
      this.setState({ loading: false });
      Alert.alert('Error', 'Failed to select level. Please try again.');
    }
  };

  renderLevelCard = (level, backgroundColor) => (
    <Pressable
      onPress={() => this.handleLevelClick(level)}
      disabled={this.state.loading}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
        LevelSelectionScreenStyles.cardWrapper,
      ]}
    >
      <Surface style={[LevelSelectionScreenStyles.surface, { backgroundColor }]} elevation={6}>
        <Text variant="titleMedium" style={LevelSelectionScreenStyles.levelText}>
          {level}
        </Text>
      </Surface>
    </Pressable>
  );
  

  render() {
    const { loading } = this.state;
  
    return (
      <View style={LevelSelectionScreenStyles.container}>
        {loading ? (
          <View style={LevelSelectionScreenStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ee" style={{ marginBottom: 20 }} />
            <Text style={LevelSelectionScreenStyles.loadingText}>
              Generating your personalized learning path...{'\n\n'}
              This may take a while. Grab a coffee and relax ☕😊
            </Text>
          </View>
        ) : (
          <>
            {this.renderLevelCard('Beginner', '#2196F3')}
            {this.renderLevelCard('Intermediate', '#FF9800')}
            {this.renderLevelCard('Advanced', '#9C27B0')}
          </>
        )}
      </View>
    );
  }  
}
