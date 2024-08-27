import React, {useEffect, useState} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type SunriseSunsetProps = {
  sunrise: number;
  sunset: number;
};

const SunriseSunset: React.FC<SunriseSunsetProps> = ({sunrise, sunset}) => {
  const [animation] = useState(new Animated.Value(0));
  const currentTime = Date.now();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  if (!sunrise || !sunset || isNaN(sunrise) || isNaN(sunset)) {
    console.error('Invalid sunrise or sunset values');
    return null; // or render a fallback UI
  }

  const totalTime = sunset - sunrise;
  const timeElapsed = currentTime - sunrise;
  const timePercentage = totalTime > 0 ? (timeElapsed / totalTime) * 100 : 0;

  const animatedLeftPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.min(Math.max(timePercentage, 0), 100)}%`],
  });

  const isDaytime = currentTime >= sunrise && currentTime <= sunset;
  const iconName = isDaytime ? 'sunny' : 'moon';
  console.log('Total Time:', totalTime);
  console.log('Time Elapsed:', timeElapsed);
  console.log('Time Percentage:', timePercentage);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon name="sunny" size={24} color="orange" />
        <Icon name="moon" size={24} color="white" />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Sunrise</Text>
        <Text style={styles.text}>Sunset</Text>
      </View>
      <View style={styles.barBackground}>
        <Animated.View
          style={[styles.barForeground, {left: animatedLeftPosition}]}>
          <Icon
            name={iconName}
            size={28}
            color={isDaytime ? 'orange' : 'white'}
            style={{zIndex: 1}}
          />
        </Animated.View>
      </View>
      <View style={styles.row}>
        <Text style={styles.timeText}>
          {new Date(sunrise).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.timeText}>
          {new Date(sunset).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)', // Darker background
    borderRadius: 20,
    minHeight: 150,
    maxHeight: 150,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  text: {
    color: '#d3d3d3',
  },
  barBackground: {
    height: 10,
    backgroundColor: 'rgba(239,239,240,0.4)', // Darker background for the bar
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    position: 'relative',
  },
  barForeground: {
    position: 'absolute',
    top: -10, // Adjust this to place the icon correctly on the bar
    transform: [{translateX: -14}], // Center the icon on the bar
  },
  timeText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
});

export default SunriseSunset;
