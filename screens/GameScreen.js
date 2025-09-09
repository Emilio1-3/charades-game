import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, StatusBar, Animated } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { AntDesign } from '@expo/vector-icons';

const words = [
  'Tiger',
  'Laptop',
  'Pineapple',
  'Helicopter',
  'Dancer',
  'Doctor',
  'Volcano',
  'Robot',
];

export default function GameScreen({ navigation }) {
  const [word, setWord] = useState('');
  const [timer, setTimer] = useState(60);
  const [correctCount, setCorrectCount] = useState(0);
  const [flashColor, setFlashColor] = useState(null);
  const [flashMessage, setFlashMessage] = useState('');
  const lastShakeTime = useRef(0);
  const soundRef = useRef(null);

  const flashOpacity = useRef(new Animated.Value(0)).current;

  const getRandomWord = () => {
    let newWord;
    do {
      newWord = words[Math.floor(Math.random() * words.length)];
    } while (newWord === word);
    setWord(newWord);
  };

  const playSound = async (file) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync(file);
    soundRef.current = sound;
    await sound.playAsync();
  };

  const flashScreen = (type) => {
    if (type === 'correct') {
      setCorrectCount((prev) => prev + 1);
      setFlashColor('#2ecc71');
      setFlashMessage('CORRECT');
      playSound(require('../assets/correct.wav'));
    } else if (type === 'pass') {
      setFlashColor('#e74c3c');
      setFlashMessage('PASS');
      playSound(require('../assets/pass.wav'));
    }

    Vibration.vibrate(300);

    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 800, delay: 400, useNativeDriver: true}),
    ]).start(() => {
      setFlashColor(null);
      setFlashMessage('');
      getRandomWord();
    });
  };

  const handleTilt = ({ y }) => {
    const now = Date.now();
    if (now - lastShakeTime.current < 1200) return;

    if (y < -0.8) {
      flashScreen('correct');
      lastShakeTime.current = now;
    } else if (y > 0.8) {
      flashScreen('pass');
      lastShakeTime.current = now;
    }
  };

  useEffect(() => {
    // Force fullscreen landscape
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
    getRandomWord();

    Accelerometer.setUpdateInterval(300);
    const subscription = Accelerometer.addListener(handleTilt);

    return () => {
      subscription.remove();
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      navigation.replace('End', { score: correctCount });
    }
  }, [timer]);

  const ringSize = 100;
  const ringWidth = 8;

  return (
    <View style={[styles.container, { backgroundColor: flashColor || '#6a1b9a' }]}>
      {/* Hide status bar for true fullscreen */}
      <StatusBar hidden />

      {/* Back Arrow */}
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Timer */}
      <View style={styles.timerWrapper}>
        <View
          style={[
            styles.ring,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth: ringWidth,
            },
          ]}
        />
        <Text style={styles.timerText}>{timer}s</Text>
      </View>

      {/* Word in Center */}
      <View style={styles.wordContainer}>
        {flashMessage ? (
          <Text style={styles.flashText}>{flashMessage}</Text>
        ) : timer > 0 ? (
          <Text style={styles.word}>{word}</Text>
        ) : (
          <Text style={styles.word}>Time is up!</Text>
        )}
      </View>

      {/* Correct Count at Bottom */}
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{correctCount} correct</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a1b9a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  timerWrapper: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderColor: '#fff',
  },
  timerText: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  wordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  word: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  flashText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
});
