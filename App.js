import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CountdownScreen from './screens/CountdownScreen';
import GameScreen from './screens/GameScreen';
import SummaryScreen from './screens/SummaryScreen';
import TimeUpScreen from './screens/TimeUpScreen';
{/*import EndScreen from './screens/EndScreen';*/}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Countdown" component={CountdownScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
         <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
        <Stack.Screen name="TimeUp" component={TimeUpScreen} />
        {/*<Stack.Screen name="End"  component={EndScreen} />*/}
      </Stack.Navigator>
    </NavigationContainer>
  )
}