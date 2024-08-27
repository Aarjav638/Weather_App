import React, {useEffect} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';

type AirQualityProps = {
  value: number;
};

const AirQuality: React.FC<AirQualityProps> = ({value}) => {
  const animation = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const animatedWidth = animation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Air Quality</Text>
      <View style={styles.seperator} />
      <Text style={styles.AirQualityText}>Satisfactory {value}</Text>
      <Text style={styles.subtitle}>
        {' '}
        Air Quality is acceptable. However, unusually sensitive{' '}
      </Text>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barForeground,
            {
              width: animatedWidth,
              backgroundColor: value > 50 ? 'orange' : 'green',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    minHeight: 200,
    maxHeight: 200,
    marginBottom: 10,
  },
  text: {
    marginBottom: 10,
    fontSize: 14,
    color: '#d3d3d3',
    fontFamily: 'Poppins-SemiBold',
  },
  seperator: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'grey',
    marginBottom: 10,
  },
  AirQualityText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    flexWrap: 'nowrap',
  },

  barBackground: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  barForeground: {
    height: '100%',
    borderRadius: 5,
  },
});

export default AirQuality;
