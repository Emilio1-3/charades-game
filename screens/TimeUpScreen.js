import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function TimeUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Time is Up!</Text>
      <Button title="Play Again" onPress={() => navigation.replace('Countdown')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 40,
    marginBottom: 20,
  },
});