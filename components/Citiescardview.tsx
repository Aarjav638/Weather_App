import React, {useState} from 'react';
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
import {markCityAsDeleted} from '../android/app/db/Insertcitiesdetials';
import {useLocationWeather} from '../context/getLoactionWeather/getLocationWeather';
import {NavigationProp} from '@react-navigation/native';
import {CityDetails} from '../android/app/db/typing';

interface CitiesCardViewProps {
  navigation: NavigationProp<any>;
  cityDetails: CityDetails[];
  loading: boolean;
  fetchCityDetails: () => Promise<CityDetails[]>;
}

const {width} = Dimensions.get('window');

const CitiesCardView: React.FC<CitiesCardViewProps> = ({
  navigation,
  loading,
  cityDetails,
  fetchCityDetails,
}) => {
  const [selectedCities, setSelectedCities] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const {setSelectedCity, db} = useLocationWeather();
  const [CityDetails, setCityDetails] = useState<CityDetails[]>(cityDetails);

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
        await markCityAsDeleted(db, id);
      }
      setSelectionMode(false);
      setSelectedCities(new Set());
      setCityDetails(await fetchCityDetails());
    } catch (error) {
      console.error('Error marking cities as deleted:', error);
    }
  };

  const renderCityCard = ({item}: {item: CityDetails}) => {
    const isSelected = selectedCities.has(item.id || 0);
    const currentTemperature = parseFloat(item.temperature) || 'N/A';
    const cityDetails = item.city ? JSON.parse(item.city) : null;

    return (
      <TouchableOpacity
        onLongPress={() => item.id !== undefined && handleLongPress(item.id)}
        onPress={() => {
          if (selectionMode) {
            if (item.id !== undefined) {
              toggleSelection(item.id);
            }
          } else {
            setSelectedCity(
              cityDetails.cityName,
              cityDetails.state,
              cityDetails.country,
            );
            if (!loading) {
              navigation.navigate('Home');
            }
          }
        }}
        style={[styles.container, isSelected && styles.selectedContainer]}>
        <View style={styles.smallContainer}>
          <Text style={styles.textLeft}>
            {cityDetails.cityName ? cityDetails.cityName : 'Unknown'}
          </Text>
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
          data={cityDetails}
          renderItem={renderCityCard}
          keyExtractor={item => item.id?.toString() ?? item.cityId.toString()}
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
