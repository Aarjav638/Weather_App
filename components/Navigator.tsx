import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../screens/Home';
import OnBoarding from '../screens/OnBoarding';
import {StatusBar, useColorScheme} from 'react-native';
const Navigator = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? 'lightskyblue' : 'skyblue'}
      />
      <Stack.Navigator
        initialRouteName="OnBoarding"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
