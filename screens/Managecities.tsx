import React, { useEffect, useState, useCallback } from 'react';
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
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import { addCityname, getCityName } from '../android/app/db/Insertcityname';
import { connectToDatabase } from '../android/app/db/db';
import { createTables } from '../android/app/db/Citydetails';

const ManageCities = () => {
    const [response, setResponse] = useState<Record<string, string>[]>();
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [cityname, setCityname] = useState<City[]>([]);
    const [isfetch, setIsFetch] = useState(false);

    // Function to fetch city details
    const fetchCityDetails = useCallback(async () => {
        try {
            const db = await connectToDatabase();
            const cityNames = await getCityName(db);
            console.log('City Names from DB:', cityNames);

            if (cityNames) {
                setCityname(cityNames);
                setIsFetch(true);
            }
        } catch (error) {
            console.error('Error fetching city details:', error);
        }
    }, []);

    useEffect(() => {
        fetchCityDetails();
    }, [fetchCityDetails]);

    const handleCitySelection = async (city: string, state: string, country: string) => {
        try {
            console.log('Inserting:', city, state, country);  // Log to verify the values

            const db = await connectToDatabase();
            await createTables(db);  // Ensure the tables exist

            // Insert data into the City table
            const cityId = await addCityname(db, { cityName: city, state: state, country: country });
            console.log('Inserted city with ID:', cityId);  // Log the inserted city ID

            setModalVisible(false);
            fetchCityDetails(); // Trigger re-fetch of city list after adding a city
        } catch (err) {
            console.error('Error inserting city:', err);  // Log error for better debugging
            setModalVisible(false);
        }
    };

    // Debounce the search query input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 100); // 300ms debounce delay

        return () => {
            clearTimeout(handler); // Clear timeout if the input changes within 300ms
        };
    }, [searchQuery]);

    // Fetch the locations when the debouncedQuery changes
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
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={{ flex: 1 }}>
            <CitiesCardView cityname={cityname} fetchCityDetails={fetchCityDetails} />

            <TouchableOpacity style={styles.actionButtonIcon} onPress={toggleModal}>
                <Icon name="add-outline" style={styles.icon} />
            </TouchableOpacity>

            <Modal
                isVisible={isModalVisible}
                deviceWidth={Dimensions.get('window').width}
                style={{ margin: 0, marginTop: '2%' }}
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
                            renderItem={({ item }) =>
                                item.city ? (
                                    <View>
                                        <Text
                                            onPress={() => {
                                                handleCitySelection(item.city, item.state, item.country);
                                            }}
                                            style={{
                                                color: 'black',
                                                fontSize: 18,
                                                fontFamily: 'Poppins-Medium',
                                                marginBottom: 10,
                                            }}
                                        >
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
});

export default ManageCities;