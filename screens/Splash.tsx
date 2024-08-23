import React from 'react';
import { Text, Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';

const Splash: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Use ImageBackground for the background image */}
      <ImageBackground
        source={require('../assets/cloud.jpeg')} // Replace this with your background image path
        style={styles.background}
        resizeMode="cover" // Ensures the image covers the entire screen
      >
        {/* Foreground content */}
        <Image source={require('../assets/cloudy.png')} style={styles.image} />
        <Text style={styles.title}>ClimaVista</Text>
        <Text style={styles.subtitle}>Your quick weather report</Text>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',

  },
  subtitle: {
    fontSize: 18,
    color: 'grey',
  },
});

export default Splash;
