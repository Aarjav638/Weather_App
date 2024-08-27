import React, {useEffect} from 'react';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Home/Header';
import {NavigationProp} from '@react-navigation/native';
import {Images} from '../constants/images';
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

const Home = ({navigation}: {navigation: NavigationProp<any>}) => {
  const isConnected = useConnection();
  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    if (isConnected === null) {
      return;
    }
    if (!isConnected) {
      setVisible(true);
    }
  }, [isConnected]);

  // Example data for SunriseSunset component
  const sunrise = new Date().setHours(5, 55, 0); // Example sunrise time
  const sunset = new Date().setHours(18, 50, 0); // Example sunset time

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.Image}
        blurRadius={10}
        source={Images.sunnyWeather}
      />
      <Header navigation={navigation} city="Kairana" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <Temperatrure />
        <PollenStatus />
        <FlatListSuggestion />
        <HorizontalWeatherDetails />
        <SevenDaysForecast />

        <AirQuality value={70} />
        <UnitsDetails />

        <SunriseSunset sunrise={sunrise} sunset={sunset} />
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
