import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import Navigator from './components/Navigator';
import Splash from './screens/Splash';
import {LogLevel, OneSignal} from 'react-native-onesignal';

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsSplashVisible(false);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('1dcf5e4a-91d3-4365-970f-40111d84c5c8');

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  return (
    <View style={styles.container}>
      <Navigator />
      {isSplashVisible && (
        <Animated.View style={[styles.splashContainer, {opacity: fadeAnim}]}>
          <Splash />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  container: {
    flex: 1,
  },
});

export default App;
