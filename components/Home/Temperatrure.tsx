import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Temperatrure = ({
  min,
  max,
  currentTemperature,
}: {
  min: number | undefined;
  max: number | undefined;
  currentTemperature: number | null;
}) => {
  return (
    <View style={styles.WeatherContainer}>
      <Text style={styles.title}>{currentTemperature}</Text>

      <Text style={styles.subtitle}>
        Sunny {min}° / {max}° Air Quality: 60 - Satisfactory
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  WeatherContainer: {
    marginVertical: '4%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.1,
    padding: 20,
    minHeight: 250,
    maxHeight: 250,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    position: 'absolute',
    bottom: '20%',
  },
  title: {
    fontSize: 100,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
});
export default Temperatrure;
