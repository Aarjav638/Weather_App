import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connectToDatabase } from '../android/app/db/db';
import { deleteCity } from '../android/app/db/Insertcityname';

// Define the type for the City prop
interface City {
  id: number;
  cityName: string;
  state: string;
  country: string;
}

// Define the props for the CitiesCardView component
interface CitiesCardViewProps {
  cityname: City[];
  fetchCityDetails: () => void;
}

const { width } = Dimensions.get('window'); // Get device width

const CitiesCardView: React.FC<CitiesCardViewProps> = ({ cityname, fetchCityDetails }) => {
  const [selectedCities, setSelectedCities] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  const handleLongPress = (id: number) => {
    setSelectionMode(true);
    toggleSelection(id);
  };

  const toggleSelection = (id: number) => {
    setSelectedCities((prevSelected) => {
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
        await deleteCity(db, id); // Implement the deleteCity function in your database logic
      }
      setSelectionMode(false);
      setSelectedCities(new Set());
      fetchCityDetails(); // Refresh the city list after deletion
    } catch (error) {
      console.error('Error deleting cities:', error);
    }
  };

  const renderCityCard = ({ item }: { item: City }) => {
    const isSelected = selectedCities.has(item.id);

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => selectionMode && toggleSelection(item.id)}
        style={[
          styles.container,
          isSelected && styles.selectedContainer, // Apply different style if selected
        ]}
      >
        <View style={styles.smallContainer}>
          <Text style={styles.textLeft}>{item.cityName}</Text>
          <Image source={require('../assets/gps.png')} style={styles.image} />
          <Text style={styles.textRight}>31</Text>
        </View>
        <View style={styles.smallContainer2}>
          <Text style={styles.textLeft2}>Air Quality : </Text>
          <Text style={styles.textLeft2}>71</Text>
          <Text style={styles.textLeft2}> - </Text>
          <Text style={styles.textLeft2}>Good</Text>
          <Text style={styles.textRight2}>Partly cloudy</Text>
        </View>
        {isSelected && (
          <Icon name="checkmark-circle" size={30} color="white" style={styles.selectionIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {selectionMode && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={cityname}
        renderItem={renderCityCard}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    margin: width * 0.05, // Use a percentage for margins
    padding: width * 0.08, // Padding relative to screen width
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 8,
    position: 'relative',
  },
  selectedContainer: {
    backgroundColor: 'darkblue', // Change background color when selected
  },
  textLeft: {
    color: 'white',
    fontSize: width * 0.05, // Make font size responsive
    fontFamily: 'Poppins-Bold', // Use a custom font
  },
  textLeft2: {
    color: 'white',
    fontSize: width * 0.035, // Adjust the font size
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
    flex: 1, // Flexbox will automatically adjust spacing
    textAlign: 'right', // Align text to the right
  },
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallContainer2: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between', // Add spacing between text items
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
});

export default CitiesCardView;