import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('window'); // Get device width

const CitiesCardView = ({city}: {city: string}) => {
  return (
    <View style={styles.container}>
      <View style={styles.smallContainer}>
        <Text style={styles.textLeft}>{city}</Text>
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
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 8,
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
    height: width * 0.05, // Responsive image size
    width: width * 0.05, // Responsive image size
  },
});

export default CitiesCardView;
