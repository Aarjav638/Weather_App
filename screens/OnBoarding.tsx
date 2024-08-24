import {StyleSheet, SafeAreaView, View, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Icons} from '../constants/icons';
import CustomButton from '../components/CustomButton';
import AppInstructions from '../components/OnBoardingScreen/AppInstructions';
import {NavigationProp} from '@react-navigation/native';
import {Dimensions} from 'react-native';
const OnBoarding = ({navigation}: {navigation: NavigationProp<any>}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const screenWidth = -Dimensions.get('window').width;

    const animateBackAndForth = Animated.sequence([
      Animated.timing(translateX, {
        toValue: screenWidth / 6,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(animateBackAndForth).start();
  }, [translateX]);
  return (
    <SafeAreaView style={styles.container}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{flex: 0.5}}>
        <AppInstructions />
      </View>

      <CustomButton
        title="Get Started"
        isLoading={false}
        textStyles={styles.text}
        onPress={() => navigation.navigate('Home')}
        containerStyles={styles.customButtonStyles}
        icon={Icons.arrow}
        imageStyles={{transform: [{translateX}]}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  text: {
    color: 'white',
    marginLeft: '30%',
    fontFamily: 'Poppins-Bold',
  },
  customButtonStyles: {
    width: '85%',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 8,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
  },
});

export default OnBoarding;
