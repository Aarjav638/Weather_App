import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import {Images} from '../../constants/images';
import {useLocationWeather} from '../../context/getLoactionWeather/getLocationWeather';

type ItemProps = {
  time: string;
  image: ImageSourcePropType | undefined;
  temperature: number; // Change the type to number
};

const getWeatherIcon = (precipitationProbability: number) => {
  if (precipitationProbability > 70) {
    return Images.stormy_icon;
  } else if (precipitationProbability > 50) {
    return Images.rainy_icon;
  } else if (precipitationProbability > 20) {
    return Images.cloudy;
  } else {
    return Images.sunny;
  }
};

const Item = ({time, image, temperature}: ItemProps) => (
  <View style={styles.container}>
    <Text style={styles.timetext}>{time}</Text>
    <Image source={image} style={styles.image} />
    <Text style={styles.text}>{temperature}°</Text>
  </View>
);

const HorizontalWeatherDetails = () => {
  const {hourlyWeather} = useLocationWeather();

  const formattedData = hourlyWeather?.map((item, index) => {
    return {
      id: index.toString(),
      time: item.time.slice(11, 16),
      image: getWeatherIcon(item.precipitation_probability),
      temperature: item.temperature, // Convert the number to a string
    };
  });

  return (
    <View style={styles.Flatlist}>
      <FlatList
        data={formattedData}
        horizontal
        renderItem={({item}) => (
          <Item
            time={item.time}
            image={item.image}
            temperature={item.temperature}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Flatlist: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    maxHeight: 100,
    minHeight: 100,
    flex: 0.2,
    borderRadius: 10,
  },
  image: {
    height: 18,
    width: 18,
  },
  container: {
    justifyContent: 'center',
    padding: 8.5,
    alignItems: 'center',
    gap: 5,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  timetext: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
});

export default HorizontalWeatherDetails;
