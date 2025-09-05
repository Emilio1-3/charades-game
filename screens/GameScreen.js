import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Accelerometer } from 'expo-sensors';

const words = [
  'Elephant',
  'Basketball',
  'Pineapple',
  'Computer',
  'Airplane',
  'Rainforest'
];

export default function GameScreen({ navigation }) {
  const [word, setWord] = useState('');
  const [timer, setTimer] = useState(60);
  const [background, setBackground] = useState('blue');
  const [message, setMessage] = useState('');
  const [countdownAudio, setCountdownAudio] = useState();
  const [isActive, setIsActive] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const accelerometerSubscription = useRef(null);
  const lastShakeTime = useRef(0);

  const getNewWord = () => {
    const random = words[Math.floor(Math.random() * words.length)];
    setWord(random);
  };

  const flashScreen = async (type) => {
    let color = '#fff';
    let text = '';
    let soundFile;

    if (type === 'pass') {
      color = '#ff4d4d';
      text = 'PASS';
      soundFile = require('../assets/pass.wav');
      setPassCount(prev => prev + 1);
    } else {
      color = '#4CAF50';
      text = 'CORRECT';
      soundFile = require('../assets/correct.wav');
      setCorrectCount(prev => prev + 1);
    }

    setBackground(color);
    setMessage(text);

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();

    setTimeout(() => {
      setBackground('blue');
      setMessage('');
      getNewWord();
    }, 1000);
  };

  const handleTilt = ({ x, y }) => {
    const now = Date.now();
    if (now - lastShakeTime.current < 1000) return;

    if (y < -0.8) {
      flashScreen('correct');
      lastShakeTime.current = now;
    } else if (y > 0.8) {
      flashScreen('pass');
      lastShakeTime.current = now;
    }
  };

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  useEffect(() => {
    getNewWord();
    setIsActive(true);

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(countdown);
          Vibration.vibrate(1000);
          navigation.replace('SummaryScreen', {
            correct: correctCount,
            pass: passCount,
          });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (timer <= 10 && timer > 0) {
      playCountdownBeep();
    }
  }, [timer]);

  useEffect(() => {
    accelerometerSubscription.current = Accelerometer.addListener(handleTilt);
    Accelerometer.setUpdateInterval(200);

    return () => {
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.remove();
      }
    };
  }, []);

  const playCountdownBeep = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/countdown-beep.wav')
    );
    setCountdownAudio(sound);
    await sound.playAsync();
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {message ? (
        <Text style={styles.countdown}>{message}</Text>
      ) : (
        <>
          <Text style={styles.timer}>{timer}</Text>
          <Text style={styles.word}>{word}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>✅ {correctCount}</Text>
            <Text style={styles.score}>❌ {passCount}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c66b0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 60,
    color: '#444',
    fontWeight: 'bold',
    position: 'absolute',
    top: 60,
  },
  word: {
    fontSize: 120,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  countdown: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    justifyContent: 'space-between',
    width: '60%',
  },
  score: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
});
