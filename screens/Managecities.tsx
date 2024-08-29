import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CitiesCardView from '../components/Citiescardview';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {Searchbar, Snackbar} from 'react-native-paper';
import axios from 'axios';
import {addCityname} from '../db/Insertcityname';
import {getDeletedCities, deleteCityFromDB} from '../db/Insertcitiesdetials';
import {CityDetails} from '../db/typing';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {useLocationWeather} from '../context/getLoactionWeather/getLocationWeather';
import useConnection from '../hooks/useConnection';
import NetInfo from '@react-native-community/netinfo';
import {
  fetchCityWeatherDetailsFromAPI,
  getCurrentTemperature,
  addCity,
  fetchCityDetails,
  updateCity,
} from '../utils/helper';

const TTL = 30000; // 30 seconds

const ManageCities = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [response, setResponse] = useState<Record<string, string>[]>();
  const [visible, setVisible] = React.useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityDetails, setCityDetails] = useState<CityDetails[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const {loading, db} = useLocationWeather();
  const isConnected = useConnection();
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const [isActionLoading, setIsActionLoading] = useState({
    citySelection: false,
    citySync: false,
    cityDelete: false,
  });
  const [cityToDelete, setCityToDelete] = useState<number | null>(null);
  useEffect(() => {
    if (isConnected === null) {
      return;
    }
    if (!isConnected) {
      setVisible(true);
    }
  }, [isConnected]);

  //get city details from db on initial load

  useEffect(() => {
    (async () => {
      if (isFetching) {
        return;
      }
      console.log('fetching city details');

      setCityDetails(await fetchCityDetails());
      setIsFetching(true);
    })();
  }, [isFetching]);

  const handleCitySelection = async (
    city: string,
    state: string,
    country: string,
  ) => {
    setIsActionLoading({...isActionLoading, citySelection: true});
    try {
      // Check if the city with the same name and state already exists in the list
      const existingCity = cityDetails.find(detail => {
        const cityDetail = detail.city ? JSON.parse(detail.city) : null;
        return cityDetail?.city === city && cityDetail?.state === state;
      });

      const weatherData = await fetchCityWeatherDetailsFromAPI(
        city,
        state,
        country,
      );

      if (weatherData.hourly) {
        const currentTemperature = getCurrentTemperature(weatherData.hourly);
        const cityNameDetails = {city, state, country};

        const cityDetails1: CityDetails = {
          cityId: existingCity
            ? existingCity.cityId
            : await addCityname(db, {city: city, state, country}),
          temperature: currentTemperature?.toString() ?? '0',
          airQuality: '71',
          date: new Date(),
          city: JSON.stringify(cityNameDetails),
          weatherDetails: JSON.stringify(weatherData),
        };

        if (existingCity) {
          console.log('updating city details');
          await updateCity(cityDetails1);
          setCityDetails(prevDetails =>
            prevDetails.map(detail =>
              detail.cityId === existingCity.cityId ? cityDetails1 : detail,
            ),
          );
        } else {
          // Add new city details
          console.log('adding city details');
          await addCity(cityDetails1);
          setCityDetails(prevDetails => [...prevDetails, cityDetails1]);
        }
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error selecting city:', error);
    } finally {
      setIsActionLoading({...isActionLoading, citySelection: false});
    }
  };

  const handleDeleteCity = async (cityId: number) => {
    setCityToDelete(cityId);

    try {
      setIsActionLoading(prev => ({...prev, cityDelete: true}));
      await deleteCityFromDB(db, cityId);

      setCityDetails(await fetchCityDetails());
    } catch (error) {
      console.error('Error deleting city:', error);
      setCityDetails(await fetchCityDetails());

      setIsActionLoading(prev => ({...prev, cityDelete: false}));
    } finally {
      setIsActionLoading(prev => ({...prev, cityDelete: false}));
      setCityToDelete(null);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      getLocations(searchQuery);
    }
  }, [searchQuery]);

  const getLocations = async (searchQuery1: string) => {
    try {
      const response1 = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchQuery1}&format=json&apiKey=07a421da47de4677978182f0c6246538`,
      );
      setResponse(response1.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const syncDeletedCities = async () => {
    try {
      setIsActionLoading({...isActionLoading, cityDelete: true});
      const deletedCities = await getDeletedCities(db);
      for (const city of deletedCities) {
        await deleteCityFromDB(db, city.id!);
      }
      setCityDetails(await fetchCityDetails());
    } catch (error) {
      console.error('Error syncing deleted cities:', error);
    } finally {
      setIsActionLoading({...isActionLoading, cityDelete: false});
      setCityDetails(await fetchCityDetails());
    }
  };

  const syncCityWeatherDetails = async () => {
    setIsActionLoading({...isActionLoading, citySync: true});
    try {
      const cities = await fetchCityDetails();
      if (cities.length > 0) {
        setCityDetails(cities);
      }
      for (const city of cities) {
        const cityInfo = city.city ? JSON.parse(city.city) : null;
        const weatherData = await fetchCityWeatherDetailsFromAPI(
          cityInfo.cityName,
          cityInfo.state,
          cityInfo.country,
        );
        if (weatherData) {
          const currentTemperature = getCurrentTemperature(weatherData.hourly);
          const updatedCityDetails: CityDetails = {
            ...city,
            temperature: currentTemperature?.toString() ?? '0',
            weatherDetails: JSON.stringify(weatherData),
            date: new Date(),
          };
          await updateCity(updatedCityDetails);
        }
      }
    } catch (error) {
      console.error('Error syncing city weather details:', error);
    } finally {
      setIsActionLoading({...isActionLoading, citySync: false});
    }
  };

  const handleConnectivityChange = useCallback(() => {
    if (isConnected) {
      syncDeletedCities();
      syncCityWeatherDetails();
    }
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setCityDetails(await fetchCityDetails());
      })();
    }, []),
  );
  const onDismissSnackBar = () => setVisible(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return () => unsubscribe();
  }, [handleConnectivityChange]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      if (isConnected && currentTime - lastSyncTime >= TTL) {
        syncCityWeatherDetails();
        setLastSyncTime(currentTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isConnected, lastSyncTime]);

  if (
    isActionLoading.cityDelete ||
    isActionLoading.citySelection ||
    isActionLoading.citySync
  ) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.flexContainer}>
      <CitiesCardView
        navigation={navigation}
        cityDetails={cityDetails}
        loading={loading || isActionLoading.cityDelete}
        onDeleteCity={handleDeleteCity}
        cityToDelete={cityToDelete}
      />

      <TouchableOpacity
        style={styles.actionButtonIcon}
        onPress={toggleModal}
        disabled={!isConnected}>
        <Icon name="add-outline" style={styles.icon} />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        deviceWidth={Dimensions.get('window').width}
        style={styles.modalStyle}
        deviceHeight={Dimensions.get('window').height}
        backdropOpacity={0.9}>
        <View style={styles.container}>
          <View style={styles.mainContainer}>
            <Text onPress={() => setModalVisible(false)} style={styles.cancel}>
              Cancel
            </Text>
            <Text style={styles.addCity}>Add City</Text>
          </View>
          <View style={styles.searchBarContainer}>
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              elevation={3}
            />
          </View>
          <View style={styles.flatView}>
            {isActionLoading.citySelection ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <FlatList
                data={response}
                renderItem={({item}) =>
                  item.city ? (
                    <Text
                      onPress={() =>
                        handleCitySelection(item.city, item.state, item.country)
                      }
                      style={styles.cityText}>
                      {item.city} , {item.state} , {item.country}
                    </Text>
                  ) : null
                }
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        </View>
      </Modal>
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={Snackbar.DURATION_SHORT}
          style={styles.snackbar}>
          <Text style={styles.snackBarText}>
            {isConnected
              ? 'Connected to the internet'
              : 'No internet connection, please Connect to internet for better expercience'}
          </Text>
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  actionButtonIcon: {
    borderRadius: 62,
    backgroundColor: 'red',
    height: 62,
    width: 62,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
    right: 20,
    elevation: 10,
    shadowColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    paddingTop: 22,
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  cancel: {
    color: 'blue',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    flex: 0.8,
  },
  addCity: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  searchBarContainer: {
    padding: 20,
  },
  flatView: {
    flex: 1,
    maxHeight: '35%',
    width: '85%',
    alignSelf: 'center',
  },
  cityText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStyle: {
    margin: 0,
    marginTop: '2%',
  },
  snackbarContainer: {alignItems: 'center', padding: 20},
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

export default ManageCities;
