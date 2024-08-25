import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../screens/Home';
import OnBoarding from '../screens/OnBoarding';
import {StatusBar} from 'react-native';
import ManageCities from '../screens/Managecities';
import Settings from '../screens/Settings';
const Navigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'transparent'}
        translucent={true}
      />
      <Stack.Navigator
        initialRouteName="OnBoarding"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{
            animation: 'slide_from_right',
            headerShadowVisible: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Manage Cities"
          component={ManageCities}
          options={{
            title: 'Manage Cities',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
            },
            animation: 'slide_from_bottom',
            headerShadowVisible: false,
            headerShown: true,
            headerStyle: {
              backgroundColor: 'skyblue',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: 'Settings',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
            },
            animation: 'slide_from_right',
            animationTypeForReplace: 'pop',
            headerShadowVisible: false,
            headerShown: true,
            headerStyle: {
              backgroundColor: 'skyblue',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
