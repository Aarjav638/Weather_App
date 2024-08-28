import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useLocationWeather} from '../../context/getLoactionWeather/getLocationWeather';
import {Images} from '../../constants/images';

const SevenDaysForecast = () => {
  const {forecastData} = useLocationWeather();
  const getWeatherIcon = (temprature: number) => {
    if (temprature > 30) {
      return Images.sunny;
    }
    if (temprature > 20) {
      return Images.cloudy;
    }
    if (temprature > 10) {
      return Images.rainy_icon;
    }
    return Images.stormy_icon;
  };

  return (
    <View style={styles.container}>
      {forecastData?.map((data, index) => {
        return (
          <View key={index} style={styles.internalcontainer}>
            <Text style={styles.datetext}>{data.time}</Text>

            <Image
              source={getWeatherIcon(Number(data.temprature_2m.toPrecision(2)))}
              style={styles.image}
            />

            <Text style={styles.text}>
              {data.temprature_2m.toPrecision(2)}° C
            </Text>
          </View>
        );
      })}
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.txt}>15-day weather forecast</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 18,
    width: 18,
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    maxHeight: 400,
    minHeight: 400,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  internalcontainer: {
    flexDirection: 'row',
    padding: 0,
    justifyContent: 'space-between',
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    flex: 0.3,
  },
  datetext: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    width: '42%',
  },
  btn: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 30,
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 5,
  },
  txt: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    alignSelf: 'center',
  },
});

export default SevenDaysForecast;
