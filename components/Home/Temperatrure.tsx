import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useLocationWeather} from '../../context/getLoactionWeather/getLocationWeather';

const Temperature = ({
  min,
  max,
  currentTemperature,
}: {
  min: number | undefined;
  max: number | undefined;
  currentTemperature: number | null;
}) => {
  const {hourlyWeather} = useLocationWeather();
  const currentHour = new Date().getHours();

  // Find the current hour's weather data
  const currentHourData = hourlyWeather?.find(item => {
    const hour = new Date(item.time).getHours();
    return hour === currentHour;
  });

  // Extract relevant data
  const precipitationProbability =
    currentHourData?.precipitation_probability || 0;
  const visibility = currentHourData?.visibility
    ? currentHourData.visibility / 1000
    : 10; // Convert meters to kilometers
  const cloudCover = 0; // Assuming cloud cover data is not provided. Set default or use actual if available.

  // Determine the weather condition name
  const getWeatherName = (
    precipitationProbability: number,
    visibility: number,
  ) => {
    if (precipitationProbability > 80) {
      return 'Stormy';
    } else if (precipitationProbability > 50) {
      return 'Rainy';
    } else if (visibility < 5) {
      return 'Hazy';
    } else if (cloudCover > 70) {
      return 'Mostly Cloudy';
    } else if (cloudCover > 50) {
      return 'Partly Cloudy';
    } else if (cloudCover > 20) {
      return 'Mostly Sunny';
    } else {
      return 'Sunny';
    }
  };

  const weatherName = getWeatherName(precipitationProbability, visibility);

  return (
    <View style={styles.WeatherContainer}>
      <Text style={styles.title}>{currentTemperature}°</Text>
      <Text style={styles.subtitle}>
        {weatherName} {min}° / {max}° Air Quality: 60 - Satisfactory
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

export default Temperature;
