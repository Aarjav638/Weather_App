import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Images} from '../../constants/images';

const DATA = [
  {
    id: '1',
    date: '26 Aug Today',
    image: Images.cloudy2,
    temperature: '31',
    today: 'Today',
  },
  {
    id: '2',
    date: '26 Aug Tomorrow',
    image: Images.cloudy2,
    temperature: '35',
    tomorrow: 'Tomorrow',
  },
  {
    id: '3',
    date: '26 Aug Wed',
    image: Images.cloudy2,
    temperature: '31',
    wed: 'Wed',
  },
  {
    id: '4',
    date: '26 Aug Thu',
    image: Images.cloudy2,
    temperature: '31',
    thu: 'Thu',
  },
  {
    id: '5',
    date: '26 Aug Fri',
    image: Images.cloudy2,
    temperature: '31',
    fri: 'Fri',
  },
  {
    id: '6',
    date: '26 Aug Sat',
    image: Images.cloudy2,
    temperature: '26',
    sat: 'Sat',
  },

  {
    id: '7',
    date: '26 Aug Sun',
    image: Images.cloudy2,
    temperature: '31',
    sun: 'Sun',
  },
];

const SevenDaysForecast = () => {
  return (
    <View style={styles.container}>
      {DATA.map((data, index) => {
        return (
          <View key={index} style={styles.internalcontainer}>
            <Text style={styles.datetext}>{data.date}</Text>

            <Image source={data.image} style={styles.image} />

            <Text style={styles.text}>
              {data.temperature}/{data.temperature}
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
