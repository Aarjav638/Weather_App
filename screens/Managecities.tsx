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
import {addCityname, getCityName} from '../android/app/db/Insertcityname';
import {
  addCityDetails,
  getCityDetail,
  updateCityDetails,
} from '../android/app/db/Insertcitiesdetials';
import {connectToDatabase} from '../android/app/db/db';
import {City, CityDetails} from '../android/app/db/typing';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {useLocationWeather} from '../context/getLoactionWeather/getLocationWeather';
import useConnection from '../hooks/useConnection';

const ManageCities = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [response, setResponse] = useState<Record<string, string>[]>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [cityname, setCityname] = useState<City[]>([]);
  const {loading, db} = useLocationWeather();
  const isConnected = useConnection();

  // Function to fetch weather details for each city from the API
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
      return weather_response.data.hourly;
    } catch (error) {
      console.error('Error fetching weather details from API:', error);
      return null;
    }
  };

  // Sync data with the API when online
  const syncCityWeatherData = async (CityDetails: CityDetails[]) => {
    try {
      const citiesWithUpdatedWeather = await Promise.all(
        CityDetails.map(async city => {
          const weatherData = await fetchCityWeatherDetailsFromAPI(
            city.city.cityName,
            city.city.state,
            city.city.country,
          );

          if (weatherData) {
            const currentHour = new Date().getHours();
            const weatherTimeArray = weatherData.time.map(
              (timeString: string) => new Date(timeString).getHours(),
            );
            const currentHourIndex = weatherTimeArray.indexOf(currentHour);
            const currentTemperature =
              currentHourIndex !== -1
                ? weatherData.temperature_2m[currentHourIndex]
                : city.temperature;

            // Update the local database with new weather data
            await updateCityDetails(db, {
              temperature: currentTemperature,
              airQuality: '71',
              cityId: city.cityId,
              date: new Date(),
              weatherDetails: JSON.stringify(weatherData),
            });
            city.temperature = currentTemperature; // Update the temperature in the UI
          } else {
            // No weather data available from API, fall back to existing database data
            console.log(`No updated weather data for ${city.city?.cityName}`);
          }
          return city;
        }),
      );

      setCityname(citiesWithUpdatedWeather);
    } catch (error) {
      console.error('Error syncing city weather data:', error);
    }
  };

  const addCityDetails_Table = async (cityNames: CityDetails[]) => {
    try {
      const citiesWithUpdatedWeather = await Promise.all(
        cityNames.map(async city => {
          const weatherData = await fetchCityWeatherDetailsFromAPI(
            city.cityName,
            city.state,
            city.country,
          );

          if (weatherData) {
            const currentHour = new Date().getHours();
            const weatherTimeArray = weatherData.time.map(
              (timeString: string) => new Date(timeString).getHours(),
            );
            const currentHourIndex = weatherTimeArray.indexOf(currentHour);
            const currentTemperature =
              currentHourIndex !== -1
                ? weatherData.temperature_2m[currentHourIndex]
                : city.temperature;

            // Update the local database with new weather data
            await addCityDetails(db, {
              temperature: currentTemperature,
              airQuality: '71',
              cityId: city.id,
              date: new Date(),
              weatherDetails: JSON.stringify(weatherData),
            });
            city.temperature = currentTemperature; // Update the temperature in the UI
          } else {
            // No weather data available from API, fall back to existing database data
            console.log(`No updated weather data for ${city.cityName}`);
          }
          return city;
        }),
      );

      setCityname(citiesWithUpdatedWeather);
    } catch (error) {
      console.error('Error syncing city weather data:', error);
    }
  };

  // Function to fetch city details either from the API or local database
  const fetchCityDetails = useCallback(async () => {
    try {
      const cityNames = await getCityName(db);
      console.log(cityNames);

      if (cityNames) {
        setCityname(cityNames);
        if (isConnected) {
          await syncCityWeatherData(cityNames); // Sync and update data when online
        }
      }
    } catch (error) {
      console.error('Error fetching city details:', error);
    }
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      fetchCityDetails();
    }, [fetchCityDetails]),
  );

  // Function to handle the selection of a city from the search results
  const handleCitySelection = async (
    city: string,
    state: string,
    country: string,
  ) => {
    try {
      await addCityname(db, {cityName: city, state: state, country: country});
      setModalVisible(false);
      fetchCityDetails();
    } catch (err) {
      console.error('Error inserting city:', err);
      setModalVisible(false);
    }
  };

  // Debounce the search query input
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

  return (
    <View style={{flex: 1}}>
      <CitiesCardView
        navigation={navigation}
        cityname={cityname}
        loading={loading}
        fetchCityDetails={fetchCityDetails}
      />

      <TouchableOpacity style={styles.actionButtonIcon} onPress={toggleModal}>
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
