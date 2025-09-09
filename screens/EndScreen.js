import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function EndScreen({ route, navigation }) {
  const { score } = route.params;

  return (
    <View style={Styles.Container}>
      <Text style={styles.title}>Time is Up!</Text>
      <Text style={styles.score}>Final Score: {score} </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Game')}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a1b9a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  score: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6a1b9a',
  },
});