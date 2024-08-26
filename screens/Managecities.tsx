import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CitiesCardView from '../components/Citiescardview';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {Searchbar, Snackbar} from 'react-native-paper';
import axios from 'axios';
import useConnection from '../hooks/useConnection';

const ManageCities = () => {
  const [visible, setVisible] = React.useState(false);
  const [response, setResponse] = useState<Record<string, string>[]>();
  const [city, setCity] = useState<string>('Kairana');
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const isConnected = useConnection();

  useEffect(() => {
    if (isConnected === false) {
      setVisible(true);
    }
  }, [isConnected]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 100); // 100ms debounce delay

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
      if (response.data.results.length !== 0) {
        setResponse(response.data.results);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleModal = () => {
    if (isConnected) {
      setModalVisible(!isModalVisible);
    } else {
      setVisible(true);
    }
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={{flex: 1}}>
      <CitiesCardView city={city} />

      <TouchableOpacity style={styles.actionButtonIcon} onPress={toggleModal}>
        <Icon name="add-outline" style={styles.icon} />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        deviceWidth={Dimensions.get('window').width}
        style={{margin: 0, backgroundColor: 'skyblue', paddingTop: '2%'}}
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
                      onPress={() => {
                        setCity(item.city);
                        setModalVisible(false);
                      }}
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontFamily: 'Poppins-Medium',
                        marginBottom: 10,
                      }}>
                      {item.city} , {item.state} , {item.country}
                    </Text>
                  </View>
                ) : null
              }
              keyExtractor={(item, index) => index.toString()} // Use index or any unique field from the response as a key
            />
          </View>
        </View>
      </Modal>

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
  snackbar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    maxHeight: 70,
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 15,
  },
  snackBarText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ManageCities;
