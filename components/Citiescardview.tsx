import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connectToDatabase} from '../android/app/db/db';
import {deleteCity, getCityName} from '../android/app/db/Insertcityname';
import {useLocationWeather} from '../context/getLoactionWeather/getLocationWeather';
import {NavigationProp} from '@react-navigation/native';

interface City {
  id: number;
  cityName: string;
  state: string;
  country: string;
  temperature: number;
  airQuality?: string;
}

interface CitiesCardViewProps {
  navigation: NavigationProp<any>;
  cityname: City[];
  loading: boolean;
  fetchCityDetails: () => void;
}

const {width} = Dimensions.get('window');

const CitiesCardView: React.FC<CitiesCardViewProps> = ({
  navigation,
  loading,
  cityname,
  fetchCityDetails,
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
      const db = await connectToDatabase();
      for (const id of selectedCities) {
        await deleteCity(db, id);
      }
      setSelectionMode(false);
      setSelectedCities(new Set());
      fetchCityDetails(); // Refresh the city list
    } catch (error) {
      console.error('Error deleting cities:', error);
    }
  };

  const renderCityCard = ({item}: {item: City}) => {
    const isSelected = selectedCities.has(item.id);
    const currentTemperature = item.temperature; // Always use the temperature from the database

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => {
          if (selectionMode) {
            toggleSelection(item.id);
          } else {
            setSelectedCity(item.cityName, item.state, item.country);
            if (!loading) {
              navigation.navigate('Home');
            }
          }
        }}
        style={[styles.container, isSelected && styles.selectedContainer]}>
        <View style={styles.smallContainer}>
          <Text style={styles.textLeft}>{item.cityName}</Text>
          <Image source={require('../assets/gps.png')} style={styles.image} />
          <Text style={styles.textRight}>{currentTemperature}°</Text>
        </View>
        <View style={styles.smallContainer2}>
          <Text style={styles.textLeft2}>Air Quality : </Text>
          <Text style={styles.textLeft2}>{item.airQuality ?? 'N/A'}</Text>
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
          data={cityname}
          renderItem={renderCityCard}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
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
    backgroundColor: 'darkblue',
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
