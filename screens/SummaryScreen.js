import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SummaryScreen({ route, navigation }) {
  const { correct, pass } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time's Up! ⏰</Text>
      <Text style={styles.score}>✅ Correct: {correct}</Text>
      <Text style={styles.score}>❌ Passed: {pass}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('GameScreen')}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#999' }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  score: {
    fontSize: 30,
    color: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
