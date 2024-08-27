import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {Images} from '../../constants/images';
import {useLocationWeather} from '../../context/getLoactionWeather/getLocationWeather';

const UnitsDetails = () => {
  const {dailyWeather} = useLocationWeather();
  const getUVCategory = (uvIndex: number | undefined) => {
    if (uvIndex && uvIndex >= 8) {
      return 'High';
    } else if (uvIndex && uvIndex >= 3) {
      return 'Moderate';
    } else {
      return 'Weak';
    }
  };
  const DATA = [
    {
      id: '1',
      date: 'UV',
      image: Images.cloudy2,
      temperature: `${dailyWeather?.uv_index_max[0].toPrecision(
        1,
      )} ${getUVCategory(
        Number(dailyWeather?.uv_index_max[0].toPrecision(1)),
      )}`,
      today: 'Today',
    },
    {
      id: '2',
      date: 'Feels like',
      image: Images.cloudy2,
      temperature: '35',
      tomorrow: 'Tomorrow',
    },
    {
      id: '3',
      date: 'Humidity',
      image: Images.cloudy2,
      temperature: '72%',
      wed: 'Wed',
    },
    {
      id: '4',
      date: 'E wind',
      image: Images.cloudy2,
      temperature: 'Level 3',
      thu: 'Thu',
    },
    {
      id: '5',
      date: 'Air pressure',
      image: Images.cloudy2,
      temperature: '1000 hpa',
      fri: 'Fri',
    },
    {
      id: '6',
      date: 'Visibility',
      image: Images.cloudy2,
      temperature: '12 km',
      sat: 'Sat',
    },
  ];
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        gap: 8,
        width: '100%',
        flexWrap: 'wrap',
      }}>
      {DATA.map((item, index) => (
        <View style={styles.container} key={index}>
          <Image source={Images.cloudy2} style={styles.image} />
          <Text style={styles.timetext}>{item.date}</Text>
          <Text style={styles.text}>{item.temperature}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 18,
    width: 18,
  },
  container: {
    padding: 8,

    gap: 10,
    width: '31%',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    maxHeight: 100,
    minHeight: 100,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  timetext: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});

export default UnitsDetails;
