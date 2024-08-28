import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Images} from '../../constants/images';
import {useLocationWeather} from '../../context/getLoactionWeather/getLocationWeather';

const UnitDetails = () => {
  const {hourlyWeather, dailyWeather} = useLocationWeather();

  if (!hourlyWeather || hourlyWeather.length === 0) {
    return <Text style={styles.errorText}>No data available</Text>;
  }
  const getUVCategory = (uvIndex: number | undefined) => {
    if (uvIndex && uvIndex >= 8) {
      return 'High';
    } else if (uvIndex && uvIndex >= 3) {
      return 'Moderate';
    } else {
      return 'Weak';
    }
  };

  // Get the current hour's weather data
  const currentHour = new Date().getHours();
  const currentHourData = hourlyWeather.find(item => {
    const hour = new Date(item.time).getHours();
    return hour === currentHour;
  });

  if (!currentHourData) {
    return <Text style={styles.errorText}>No data for the current hour</Text>;
  }

  const visibilityInKm = (currentHourData.visibility / 1000).toFixed(1); // Convert visibility to km

  const details = [
    {
      label: 'UV Index',
      value: `${dailyWeather?.uv_index_max.toPrecision(2)} ${getUVCategory(
        Number(dailyWeather?.uv_index_max.toPrecision(1)),
      )}`, // Assuming you calculate or have this value elsewhere
    },
    {
      label: 'Feels Like',
      value: `${currentHourData.temperature}°C`, // Assuming feels like is close to the temperature
    },
    {
      label: 'Humidity',
      value: `${currentHourData.humidity}%`,
    },
    {
      label: 'Wind',
      value: `${currentHourData.wind_speed_10m} km/h`,
    },
    {
      label: 'Visibility',
      value: `${visibilityInKm} km`,
    },
    {
      label: 'Precipitation',
      value: `${currentHourData.precipitation} mm`,
    },
  ];

  return (
    <View style={styles.container}>
      {details.map((detail, index) => (
        <View key={index} style={styles.card}>
          <Image source={Images.sunny} style={styles.image} />
          <Text style={styles.labelText}>{detail.label}</Text>
          <Text style={styles.valueText}>{detail.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 8,
    width: '100%',
    flex: 1,
  },
  card: {
    padding: 8,
    justifyContent: 'space-evenly',

    width: '31%',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    maxHeight: 120,
    minHeight: 100,
  },
  image: {
    height: 18,
    width: 18,
  },
  labelText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  valueText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UnitDetails;
