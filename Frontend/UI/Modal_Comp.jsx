import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Text,
  Pressable,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import YouTubeIframe from 'react-native-youtube-iframe';
import { LearningScreenStyles } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../router/routes';

const windowWidth = Dimensions.get('window').width;

const ModalComp = ({ topic, onXPUpdate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

  const loadCompletedStatus = async () => {
    try {
      setIsLoading(true);
      const key = `completed_${topic.name}`;
      const savedData = await AsyncStorage.getItem(key);
      
      if (savedData) {
        setCompletedModules(JSON.parse(savedData));
      } else {
        const initialState = {};
        if (topic?.modules) {
          topic.modules.forEach(module => {
            initialState[module.title] = false;
          });
          setCompletedModules(initialState);
        }
      }
    } catch (error) {
      console.error('Error loading completed status:', error);
      setCompletedModules({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompletedStatus();
  }, [topic.name]);
  
  useEffect(() => {
    if (modalVisible) {
      loadCompletedStatus();
    }
  }, [modalVisible]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/|(?:.*[?&]v=))([a-zA-Z0-9_-]{11}))(?:[^\s]*)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleMarkAsComplete = async (moduleTitle) => {
    try {
      const gameName = await AsyncStorage.getItem('gameName');
      const level = await AsyncStorage.getItem('level');

      if (!gameName || !level) {
        Alert.alert('Error', 'Missing game or level information');
        return;
      }

      const response = await api.completeModule(gameName, level, topic.name, moduleTitle);

      const newCompletedModules = {
        ...completedModules,
        [moduleTitle]: true
      };

      setCompletedModules(newCompletedModules);

      const key = `completed_${topic.name}`;
      await AsyncStorage.setItem(key, JSON.stringify(newCompletedModules));

      Alert.alert('Module Completed!', `You earned ${response.xpEarned} XP`, [{ text: 'OK' }]);

      if (onXPUpdate) {
        onXPUpdate(response.totalXP);
      }

    } catch (error) {
      console.error('Error marking module as complete:', error);
      Alert.alert('Error', 'Failed to mark module as complete');
    }
  };

  const renderItem = ({ item }) => {
    const videoId = item.ytLink && item.ytLink.length > 0 ? extractVideoId(item.ytLink[0]) : null;
    const isCompleted = completedModules[item.title] === true;

    return (
      <View style={[LearningScreenStyles.slideContainer, { width: windowWidth * 0.85 }]}>
        <ScrollView
          style={LearningScreenStyles.slideScrollView}
          contentContainerStyle={LearningScreenStyles.slideScrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={LearningScreenStyles.moduleContainer}>
            <View style={LearningScreenStyles.moduleHeaderRow}>
              <Text style={LearningScreenStyles.moduleTitle}>{item.title}</Text>
              {isCompleted && (
                <View style={LearningScreenStyles.completedBadge}>
                  <Text style={LearningScreenStyles.completedText}>✓</Text>
                </View>
              )}
            </View>

            <Text style={LearningScreenStyles.sectionHeading}>Overview</Text>
            <Text style={LearningScreenStyles.moduleContent}>{item.content}</Text>

            {videoId && (
              <>
                <YouTubeIframe
                  videoId={videoId}
                  height={200}
                  width="100%"
                  play={false}
                />
                <Text style={LearningScreenStyles.sectionHeading}>Video Summary</Text>
                <Text style={LearningScreenStyles.moduleLink}>{item.ytSummary}</Text>
              </>
            )}

            <Pressable
              style={[
                LearningScreenStyles.completeButton,
                isCompleted && LearningScreenStyles.completeButtonDisabled
              ]}
              onPress={() => handleMarkAsComplete(item.title)}
              disabled={isCompleted}
            >
              <Text style={LearningScreenStyles.completeButtonText}>
                {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={LearningScreenStyles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={LearningScreenStyles.backdrop}>
            <View style={LearningScreenStyles.modalView}>
              <View style={LearningScreenStyles.flatListContainer}>
                <FlatList
                  ref={flatListRef}
                  data={topic.modules}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={LearningScreenStyles.flatListContent}
                  snapToAlignment="center"
                  snapToInterval={windowWidth * 0.85}
                  decelerationRate="fast"
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={viewabilityConfig}
                />
              </View>
              {topic.modules.length > 1 && (
                <Text style={LearningScreenStyles.pageIndicator}>
                  {currentIndex + 1} / {topic.modules.length}
                </Text>
              )}
            </View>
          </View>
        </Modal>

        <Pressable
          style={[LearningScreenStyles.button, LearningScreenStyles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={LearningScreenStyles.textStyle}>
            {topic.name}
          </Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ModalComp;