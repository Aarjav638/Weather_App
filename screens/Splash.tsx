import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Animated,
} from 'react-native';

const Splash: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const fadeAnimImage = useRef(new Animated.Value(0)).current;
  const fadeAnimTitle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnimImage, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimTitle, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnimImage, fadeAnimTitle]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? 'lightskyblue' : 'skyblue'}
      />
      <Animated.Image
        source={require('../assets/cloudy.png')}
        style={[styles.image, {opacity: fadeAnimImage}]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, {opacity: fadeAnimTitle}]}>
        ClimaVista
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, {opacity: fadeAnimTitle}]}>
        Your quick weather report
      </Animated.Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    fontFamily: 'Poppins-Regular',
  },
});

export default Splash;
