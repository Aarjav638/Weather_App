import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import React from 'react';
import {Icons} from '../constants/icons';
import CustomButton from '../components/CustomButton';
import AppInstructions from '../components/OnBoardingScreen/AppInstructions';
const OnBoarding = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? 'lightskyblue' : 'skyblue'}
      />
      <View style={styles.wrapper}>
        <AppInstructions />
        <CustomButton
          title="Get Started"
          isLoading={false}
          textStyles={styles.text}
          onPress={() => console.log('Get Started')}
          containerStyles={styles.customButtonStyles}
          icon={Icons.arrow}
          imageStyles={styles.imageStyles}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  wrapper: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    marginVertical: '8%',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    marginLeft: '30%',
  },
  customButtonStyles: {
    width: '85%',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 8,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
  },
  imageStyles: {marginTop: 2},
});

export default OnBoarding;
