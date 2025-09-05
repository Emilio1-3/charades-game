import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import { Audio } from 'expo-av';

export default function CountdownScreen({ navigation }) {
  const [count, setCount] = useState(3);
  const [sound, setSound] = useState();

  useEffect(() => {
    const playBeep = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/beep.wav')
      );
      setSound(sound);
      await sound.playAsync();
    };

    if (count > 0) {
      playBeep();
      Vibration.vibrate(100);
      const timer = setTimeout(() => setCount(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigation.replace('Game');
    }

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count > 0 ? count : 'Go!'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#ff6f61',
  },
});