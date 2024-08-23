import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {OnBoardingImages} from '../../constants/images';

const AppInstructions = () => {
  const [counter, setCounter] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevCounter =>
        prevCounter === OnBoardingImages.length - 1 ? 0 : prevCounter! + 1,
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [counter]);
  return (
    <View style={styles.imageContainer}>
      <Image
        source={OnBoardingImages[counter]}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AppInstructions;
