import React, {useEffect, useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import {connectToDatabase} from '../android/app/db/db';
import {createTables} from '../android/app/db/Citydetails';
import {addCityDetails} from '../android/app/db/Insertcitiesdetials';
import {getCityDetailsWithCityNames} from '../android/app/db/getCityDetailsWithCityID';
import {addCityname} from '../android/app/db/Insertcityname';
import {CityDetails} from '../android/app/db/typing';

const Testingdb = () => {
  const [cityDetails, setCityDetails] = useState<
    (CityDetails & {city: string})[]
  >([]);

  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);

      // Insert dummy data into City
      const cityId = await addCityname(db, {
        cityName: 'London',
        state: 'up',
        country: 'india',
      });

      // Insert dummy data into cityDetails with the correct cityId
      await addCityDetails(db, {
        temperature: '30°C',
        airQuality: 'Good',
        cityId: cityId,
        date: new Date(),
        weatherDetails: 'Sunny',
      });

      // Fetch the data from the cityDetails table with city names
      // const cityData = await getCityDetailsWithCityNames(db);
      // setCityDetails(cityData);
    } catch (error) {
      console.error('Database error:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View>
      <Text>Testing Database</Text>
      {cityDetails.length > 0 ? (
        cityDetails.map(city => (
          <View key={city.id}>
            <Text>City Name: {city.cityName}</Text>
            <Text>Temperature: {city.temperature}</Text>
            <Text>Air Quality: {city.airQuality}</Text>
            <Text>Date: {new Date(city.date).toDateString()}</Text>
            <Text>Weather: {city.weatherDetails}</Text>
            <Text>City ID: {city.cityId}</Text>
          </View>
        ))
      ) : (
        <Text>No city data available</Text>
      )}
    </View>
  );
};

export default Testingdb;
