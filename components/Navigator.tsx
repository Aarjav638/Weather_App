import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import Home from '../screens/Home';
import OnBoarding from '../screens/OnBoarding';
import ManageCities from '../screens/Managecities';
import Settings from '../screens/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocationWeatherProvider} from '../context/getLoactionWeather/getLocationWeather';

const Navigator = () => {
  const [tempId, setTempId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const getTempId = async () => {
    try {
      const temp_Id = await AsyncStorage.getItem('tempId');
      setTempId(temp_Id);
    } catch (error) {
      console.error('Failed to load tempId:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getTempId();
  }, []);

  const Stack = createNativeStackNavigator();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'transparent'}
        translucent={true}
      />

      <LocationWeatherProvider>
        <Stack.Navigator
          initialRouteName={tempId ? 'Home' : 'OnBoarding'}
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
      </LocationWeatherProvider>
    </NavigationContainer>
  );
};

export default Navigator;
