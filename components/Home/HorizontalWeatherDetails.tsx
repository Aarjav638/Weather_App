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
  temperature: string;
};

const getWeatherIcon = (precipitationProbability: number) => {
  if (precipitationProbability > 50) {
    return Images.cloudy3;
  } else if (precipitationProbability > 20) {
    return Images.cloudy;
  } else {
    return Images.cloudy2;
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

  const formattedData = hourlyWeather?.time.map((t: string, index: number) => ({
    id: index.toString(),
    time: new Date(t).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    image: getWeatherIcon(hourlyWeather?.precipitation_probability[index]),
    temperature: hourlyWeather?.temperature_2m[index].toString(),
  }));

  return (
    <View
      style={{
        backgroundColor: 'rgba(0,0,0,0.1)',
        maxHeight: 100,
        minHeight: 100,
        flex: 0.2,
        borderRadius: 10,
      }}>
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
