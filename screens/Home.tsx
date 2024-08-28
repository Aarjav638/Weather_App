import React, {useEffect} from 'react';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Home/Header';
import {NavigationProp} from '@react-navigation/native';
import PollenStatus from '../components/Home/PollenStatus';
import Temperatrure from '../components/Home/Temperatrure';
import FlatListSuggestion from '../components/Home/FlatListSuggestion';
import HorizontalWeatherDetails from '../components/Home/HorizontalWeatherDetails';
import SevenDaysForecast from '../components/Home/SevenDaysForecast';
import useConnection from '../hooks/useConnection';
import {Snackbar, Text} from 'react-native-paper';
import UnitsDetails from '../components/Home/UnitsDetails';
import AirQuality from '../components/Home/AirQuality';
import SunriseSunset from '../components/Home/SunRiseSunset';
import {useLocationWeather} from '../context/getLoactionWeather/getLocationWeather';
import {Images} from '../constants/images';
import {getCityDetail} from '../android/app/db/Insertcitiesdetials';
const Home = ({navigation}: {navigation: NavigationProp<any>}) => {
  const isConnected = useConnection();
  const [visible, setVisible] = React.useState(false);
  const {hourlyWeather, dailyWeather, getCurrentTemperature, db, selectedCity} =
    useLocationWeather();
  const onDismissSnackBar = () => setVisible(false);
  useEffect(() => {
    getCityDetail(db);
  }, [db]);
  useEffect(() => {
    if (isConnected === null) {
      return;
    }
    if (!isConnected) {
      setVisible(true);
    }
  }, [isConnected]);
  const city = selectedCity.city;
  const sunriseTimeStamp = dailyWeather?.sunrise;
  const sunsetTimeStamp = dailyWeather?.sunset;
  const min = dailyWeather?.min_temperature;
  const max = dailyWeather?.max_temperature;

  const currentTemperature = getCurrentTemperature();
  const SunriseDate = new Date(sunriseTimeStamp ? sunriseTimeStamp : '');
  const SunSetDate = new Date(sunsetTimeStamp ? sunsetTimeStamp : '');

  const sunriseTime = SunriseDate.setHours(
    SunriseDate.getHours(),
    SunriseDate.getMinutes(),
    0,
    0,
  );

  const sunsetTime = SunSetDate.setHours(
    SunSetDate.getHours(),
    SunSetDate.getMinutes(),
    0,
    0,
  );
  const getWeatherIcon = (weatherName: string | undefined) => {
    if (weatherName === 'Sunny') {
      return Images.sunnyWeather;
    } else if (weatherName === 'Mostly Sunny') {
      return Images.sunny;
    } else if (weatherName === 'Partly Cloudy') {
      return Images.cloudyWeather;
    } else if (weatherName === 'Mostly Cloudy') {
      return Images.cloudyWeather;
    } else if (weatherName === 'Hazy') {
      return Images.cloudyWeather;
    } else if (weatherName === 'Rainy') {
      return Images.Rainy;
    } else if (weatherName === 'Stormy') {
      return Images.stormy;
    } else {
      return Images.sunny;
    }
  };

  // Get the current hour
  const currentHour = new Date().getHours();
  const currentHourData = hourlyWeather?.find(item => {
    const hour = new Date(item.time).getHours();
    return hour === currentHour;
  });

  const precipitationProbability_Data =
    currentHourData?.precipitation_probability || 0;
  const visibility_data = currentHourData?.visibility
    ? currentHourData.visibility / 1000
    : 10;
  const cloudCover = 0;
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

  const weatherName = getWeatherName(
    precipitationProbability_Data,
    visibility_data,
  );
  const backgroundImage = getWeatherIcon(weatherName);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.Image}
        blurRadius={10}
        source={backgroundImage}
      />
      <Header navigation={navigation} city={city} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <Temperatrure
          currentTemperature={currentTemperature}
          min={min}
          max={max}
        />
        <PollenStatus />
        <FlatListSuggestion />
        <HorizontalWeatherDetails />
        <SevenDaysForecast />
        <AirQuality value={70} />
        <UnitsDetails />
        <SunriseSunset sunrise={sunriseTime} sunset={sunsetTime} />
      </ScrollView>
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={Snackbar.DURATION_SHORT}
          style={styles.snackbar}>
          <Text style={styles.snackBarText}>
            No Internet! Connect to Cellular or Wifi Network
          </Text>
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  Image: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    color: 'white',
  },
  scrollView: {flexGrow: 1},
  snackbarContainer: {alignItems: 'center', flex: 1},
  snackbar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    maxHeight: 70,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  snackBarText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Home;
