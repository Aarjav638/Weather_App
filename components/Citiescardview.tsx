import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useLocationWeather} from '../context/getLoactionWeather/getLocationWeather';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {CityDetails} from '../db/typing';
import {getCurrentWeatherData} from '../utils/helper';

interface CitiesCardViewProps {
  navigation: NavigationProp<any>;
  cityDetails: CityDetails[];
  loading: boolean;
  onDeleteCity: (cityId: number) => Promise<void>;
  cityToDelete: number | null;
}

const {width} = Dimensions.get('window');

const getBackgroundColor = (
  temperature: number | null,
  precipitationProbability: number | null,
): string => {
  if (temperature === null || precipitationProbability === null) {
    return 'gray';
  }
  if (precipitationProbability > 80) {
    return 'darkblue';
  } else if (temperature > 30) {
    return 'red';
  } else if (temperature > 20) {
    return 'orange';
  } else if (temperature > 10) {
    return 'grey';
  } else {
    return 'lightblue';
  }
};

const CitiesCardView: React.FC<CitiesCardViewProps> = ({
  navigation,
  loading,
  cityDetails,
  onDeleteCity,
  cityToDelete,
}) => {
  const [selectedCities, setSelectedCities] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const {setSelectedCity} = useLocationWeather();

  const handleLongPress = (id: number) => {
    setSelectionMode(true);
    toggleSelection(id);
  };

  const toggleSelection = (id: number) => {
    setSelectedCities(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedCities) {
        await onDeleteCity(id);
      }
      setSelectionMode(false);
      setSelectedCities(new Set());
    } catch (error) {
      console.error('Error deleting cities:', error);
    }
  };

  // Handle the back press event
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (selectionMode) {
          setSelectionMode(false);
          setSelectedCities(new Set());
          return true; // Prevent default behavior (back navigation)
        }
        return false; // Allow default behavior (back navigation)
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [selectionMode]),
  );

  const renderCityCard = ({item}: {item: CityDetails}) => {
    const isSelected = selectedCities.has(item.id || 0);
    const isDeleting = cityToDelete === item.cityId; // Ensure correct ID comparison

    const weatherDetails = item.weatherDetails
      ? JSON.parse(item.weatherDetails)
      : null;

    const currentWeatherData = weatherDetails
      ? getCurrentWeatherData(weatherDetails.hourly)
      : null;

    const currentTemperature = currentWeatherData
      ? currentWeatherData.temperature
      : null;

    const precipitationProbability = currentWeatherData
      ? currentWeatherData.precipitation_probability
      : null;

    const cityDetails1 = item.city ? JSON.parse(item.city) : null;
    const backgroundColor = getBackgroundColor(
      currentTemperature,
      precipitationProbability,
    );

    return (
      <TouchableOpacity
        onLongPress={() => item.id !== undefined && handleLongPress(item.id)}
        onPress={() => {
          if (selectionMode) {
            if (item.id !== undefined) {
              toggleSelection(item.id);
            }
          } else if (!isDeleting) {
            setSelectedCity(
              cityDetails1.city,
              cityDetails1.state,
              cityDetails1.country,
            );
            if (!loading) {
              navigation.navigate('Home');
            }
          }
        }}
        style={[
          styles.container,
          {backgroundColor: backgroundColor},
          isSelected && styles.selectedContainer,
          isDeleting && styles.deletingContainer,
        ]}
        disabled={isDeleting} // Disable the touchable if the city is being deleted
      >
        {isDeleting ? (
          <ActivityIndicator
            size="small"
            color="white"
            style={styles.loadingIndicator}
          />
        ) : (
          <>
            <View style={styles.smallContainer}>
              <Text style={styles.textLeft}>
                {cityDetails1.city ? cityDetails1.city : 'Unknown'}
              </Text>
              <Image
                source={require('../assets/gps.png')}
                style={styles.image}
                tintColor={'white'}
              />
              <Text style={styles.textRight}>{currentTemperature}°</Text>
            </View>
            <View style={styles.smallContainer2}>
              <Text style={styles.textLeft2}>Air Quality : </Text>
              <Text style={styles.textLeft2}>
                {item.airQuality === 'N/A' ? '71' : item.airQuality}
              </Text>
              <Text style={styles.textLeft2}> - </Text>
              <Text style={styles.textLeft2}>Good</Text>
              <Text style={styles.textRight2}>Partly cloudy</Text>
            </View>
            {isSelected && (
              <Icon
                name="checkmark-circle"
                size={30}
                color="white"
                style={styles.selectionIcon}
              />
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      {selectionMode && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={cityDetails}
          renderItem={renderCityCard}
          keyExtractor={item =>
            item.id?.toString() ?? item.cityId?.toString() ?? ''
          }
          contentContainerStyle={{flexGrow: 1}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: width * 0.05,
    padding: width * 0.08,
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 8,
    position: 'relative',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: 'yellow',
  },
  deletingContainer: {
    opacity: 0.5,
  },
  textLeft: {
    color: 'white',
    fontSize: width * 0.05,
    fontFamily: 'Poppins-Bold',
  },
  textLeft2: {
    color: 'white',
    fontSize: width * 0.035,
  },
  textRight: {
    color: 'white',
    fontSize: width * 0.05,
    textAlign: 'right',
    flex: 1,
  },
  textRight2: {
    color: 'white',
    fontSize: width * 0.035,
    flex: 1,
    textAlign: 'right',
  },
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallContainer2: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  image: {
    height: width * 0.05,
    width: width * 0.05,
  },
  selectionIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default CitiesCardView;
