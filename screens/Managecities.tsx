import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';
import CitiesCardView from '../components/Citiescardview';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {Searchbar} from 'react-native-paper';
import axios from 'axios';
import {addCityname} from '../android/app/db/Insertcityname';
import {
  addCityDetails,
  getCityDetail,
  updateCityDetails,
  getDeletedCities,
  deleteCityFromDB,
} from '../android/app/db/Insertcitiesdetials';
import {CityDetails} from '../android/app/db/typing';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {useLocationWeather} from '../context/getLoactionWeather/getLocationWeather';
import useConnection from '../hooks/useConnection';
import NetInfo from '@react-native-community/netinfo';

interface HourlyWeather {
  time: string;
  temperature: number;
  humidity: number;
  precipitation_probability: number;
  precipitation: number;
  visibility: number;
  wind_speed_10m: number;
  wind_speed_80m: number;
}

const ManageCities = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [response, setResponse] = useState<Record<string, string>[]>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [cityDetails, setCityDetails] = useState<CityDetails[]>([]);
  const {loading, db} = useLocationWeather();
  const isConnected = useConnection();
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());

  const TTL = 30000; // 30 seconds

  const fetchCityWeatherDetailsFromAPI = async (
    city: string,
    state: string,
    country: string,
  ) => {
    try {
      const weather_response = await axios.post(
        'https://cjxiaojia.com/api/location',
        {
          city,
          state,
          country,
        },
      );
      return weather_response.data[0].hourly;
    } catch (error) {
      console.error('Error fetching weather details from API:', error);
      return null;
    }
  };

  const fetchCityDetails = async () => {
    const details = await getCityDetail(db);
    setCityDetails(details);
    return details;
  };

  const updateCity = async (cityDetailsProps: CityDetails) => {
    await updateCityDetails(db, cityDetailsProps);
  };

  const addCity = async (cityDetailsProps: CityDetails) => {
    await addCityDetails(db, cityDetailsProps);
  };

  const getCurrentTemperature = (weatherData: HourlyWeather[]) => {
    const currentHour = new Date().getHours();
    const currentHourData = weatherData.find(entry => {
      const entryHour = new Date(entry.time).getHours();
      return entryHour === currentHour;
    });
    if (currentHourData) {
      return currentHourData.temperature;
    } else {
      return null;
    }
  };

  const handleCitySelection = async (
    city: string,
    state: string,
    country: string,
  ) => {
    const cityId = await addCityname(db, {
      cityName: city,
      state,
      country,
    });
    const weatherData = await fetchCityWeatherDetailsFromAPI(
      city,
      state,
      country,
    );
    if (weatherData) {
      const currentTemperature = getCurrentTemperature(weatherData);
      const cityNameDetails = {
        cityName: city,
        state,
        country,
      };
      const cityDetails1: CityDetails = {
        cityId,
        temperature: currentTemperature?.toString() ?? '0',
        airQuality: '71',
        date: new Date(),
        city: JSON.stringify(cityNameDetails),
        weatherDetails: JSON.stringify(weatherData),
      };
      console.log('City details: are adding up ');
      console.log(cityDetails1);

      await addCity(cityDetails1);

      setCityDetails(prevDetails => [...prevDetails, cityDetails1]);
      await addCityname(db, {
        cityName: city,
        state,
        country,
      });

      setModalVisible(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      getLocations(debouncedQuery);
    }
  }, [debouncedQuery]);

  const getLocations = async (searchQuery: string) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchQuery}&format=json&apiKey=07a421da47de4677978182f0c6246538`,
      );
      setResponse(response.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const syncDeletedCities = async () => {
    const deletedCities = await getDeletedCities(db);
    try {
      for (const city of deletedCities) {
        await deleteCityFromDB(db, city.id!);
      }
    } catch (error) {
      console.error('Error syncing deleted cities:', error);
    }
  };

  const syncCityWeatherDetails = async () => {
    const cities = await fetchCityDetails();
    try {
      for (const city of cities) {
        const cityInfo = JSON.parse(city.city);
        const weatherData = await fetchCityWeatherDetailsFromAPI(
          cityInfo.cityName,
          cityInfo.state,
          cityInfo.country,
        );
        if (weatherData) {
          const currentTemperature = getCurrentTemperature(weatherData);
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
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCityDetails();
    }, []),
  );

  useEffect(() => {
    const handleConnectivityChange = () => {
      if (isConnected) {
        syncDeletedCities();
        syncCityWeatherDetails();
      }
    };

    const unsubscribe = NetInfo.addEventListener(() => {
      handleConnectivityChange();
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  // Sync every 30 seconds if connected to the internet
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

  return (
    <View style={{flex: 1}}>
      <CitiesCardView
        navigation={navigation}
        cityDetails={cityDetails}
        loading={loading}
        fetchCityDetails={fetchCityDetails}
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
        style={{margin: 0, marginTop: '2%'}}
        deviceHeight={Dimensions.get('window').height}
        backdropOpacity={0.9}>
        <View style={styles.container}>
          <View style={styles.maincontainer}>
            <Text onPress={() => setModalVisible(false)} style={styles.cancel}>
              Cancel
            </Text>
            <Text style={styles.addcity}>Add City</Text>
          </View>
          <View style={styles.Searchbar}>
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              elevation={3}
            />
          </View>
          <View style={styles.flatview}>
            <FlatList
              data={response}
              renderItem={({item}) =>
                item.city ? (
                  <View>
                    <Text
                      onPress={() =>
                        handleCitySelection(item.city, item.state, item.country)
                      }
                      style={styles.cityText}>
                      {item.city} , {item.state} , {item.country}
                    </Text>
                  </View>
                ) : null
              }
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  maincontainer: {
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
  addcity: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  Searchbar: {
    padding: 20,
  },
  flatview: {
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
});

export default ManageCities;
