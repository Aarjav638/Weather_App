import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import Navigator from './components/Navigator';
import Splash from './screens/Splash';

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0]; // Single state instance

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsSplashVisible(false);
      });
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [fadeAnim]);

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
    zIndex: 1, // Ensure splash screen stays above everything else
  },
  container: {
    flex: 1,
  },
});

export default App;
