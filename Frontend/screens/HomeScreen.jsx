import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { Component } from 'react';
import { HomeScreenStyles } from '../styles';
import api from '../router/routes';

export default class HomeScreen extends Component {
  state = {
    name: ''
  };

  handleStartLearning = async () => {
    const { name } = this.state;

    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter a valid username.");
      return;
    }

    try {
      console.log('Creating/fetching user:', name);
      await api.createOrFetchUser(name);
      this.props.navigation.navigate('GameSelection');
    } catch (error) {
      console.error("User creation failed:", error);
      Alert.alert("Error", "Failed to start. Please try again.");
    }
  };

  render() {
    return (
      <View style={HomeScreenStyles.container}>
        <Text style={HomeScreenStyles.title}>👋 Welcome to ezLearn</Text>
        <Text style={HomeScreenStyles.subtitle}>
          Let's get started! Enter your unique username below.
        </Text>
        
        <TextInput
          style={HomeScreenStyles.input}
          placeholder="Enter a unique username"
          placeholderTextColor="#999"
          value={this.state.name}
          onChangeText={(text) => this.setState({ name: text })}
        />

        <TouchableOpacity
          style={HomeScreenStyles.button}
          onPress={this.handleStartLearning}
          activeOpacity={0.8}
        >
          <Text style={HomeScreenStyles.buttonText}>🚀 Start Learning</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
