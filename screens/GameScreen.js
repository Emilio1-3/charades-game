import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const words = [
  'Elephant',
  'Basketball',
  'Pineapple',
  'Computer',
  'Airplane',
  'Rainforest'
];

export default function GameScreen() {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [subscription, setSubscription] = useState(null);
  const [lastTilt, setLastTilt] = useState(null);

  // helper to pick random words
  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  // start the countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          Accelerometer.removeAllListeners(); //stop timer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //setup accelerometer
  useEffect(() => {
    Accelerometer.setUpdateInterval(300);
    const sub = Accelerometer.addListener(data => {
      const { y } = data;

      //Tilt forward = score 
      if (y > 0.7 && lastTilt !== 'forward') {
        setScore(score + 1);
        setCurrentWord(getRandomWord());
        setLastTilt('forward');
      }

      // Tilt back = skip 
      else if (y < -0.7 && lastTilt !== 'back') {
        setCurrentWord(getRandomWord());
        setLastTilt('back');
      }
    });

    setSubscription(sub);

    return () => {
      sub && sub.remove();
      setSubscription(null);
    };
  }, [score, lastTilt]);


  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timeLeft}s</Text>
      <Text style={styles.word}>{currentWord}</Text>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 30,
    color: '#00FFAA',
    marginBottom: 20,
  },
  word: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  score: {
    fontSize: 24,
    color: '#FFA500',
  },
});