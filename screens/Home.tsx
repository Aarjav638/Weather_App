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
const Home = ({navigation}: {navigation: NavigationProp<any>}) => {
  const isConnected = useConnection();
  const [visible, setVisible] = React.useState(false);
  const {hourlyWeather, dailyWeather, getCurrentTemperature, selectedCity} =
    useLocationWeather();
  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    if (isConnected === null) {
      return;
    }
    if (!isConnected) {
      setVisible(true);
    }
  }, [isConnected]);

  const city = selectedCity.city;
  const sunriseTimeStamp = dailyWeather?.sunrise[0];
  const sunsetTimeStamp = dailyWeather?.sunset[0];
  const min = dailyWeather?.temperature_2m_min[0];
  const max = dailyWeather?.temperature_2m_max[0];
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
  const getWeatherIcon = (precipitationProbability: number) => {
    if (precipitationProbability >= 80) {
      return Images.stormy; // Very high chance of rain, show stormy weather
    } else if (precipitationProbability >= 50) {
      return Images.Rainy; // High chance of rain, show rainy weather
    } else if (precipitationProbability >= 20) {
      return Images.cloudyWeather; // Moderate chance, show cloudy weather
    } else {
      return Images.sunnyWeather; // Low chance of rain, show sunny weather
    }
  };

  // Get the current hour
  const currentHour = new Date().getHours();

  // Find the index for the current hour
  const currentHourIndex = hourlyWeather?.time.findIndex(
    time => new Date(time).getHours() === currentHour,
  );

  // Get the precipitation probability for the current hour
  const precipitationProbability =
    currentHourIndex !== -1
      ? hourlyWeather?.precipitation_probability[currentHourIndex]
      : 0;

  // Get the background image based on the precipitation probability
  const backgroundImage = getWeatherIcon(precipitationProbability);

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
