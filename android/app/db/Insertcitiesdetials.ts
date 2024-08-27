import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {CityDetails} from './typing';

export const addCityDetails = async (
  db: SQLiteDatabase,
  cityDetails: CityDetails,
) => {
  const insertQuery = `
      INSERT INTO cityDetails (temperature, airQuality, cityId, date, weatherDetails)
      VALUES (?, ?, ?, ?, ?)
    `;
  try {
    await db.executeSql(insertQuery, [
      cityDetails.temperature,
      cityDetails.airQuality,
      cityDetails.cityId,
      cityDetails.date.toISOString(), // Ensure date is in the correct format
      cityDetails.weatherDetails,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add city details');
  }
};

export const getCityDetail = async (
  db: SQLiteDatabase,
): Promise<CityDetails[]> => {
  try {
    const city: CityDetails[] = [];
    const results = await db.executeSql('SELECT * FROM cityDetails');
    results?.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        city.push(result.rows.item(index));
      }
    });
    return city;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get details from database');
  }
};

export const updateCityDetails = async (
  db: SQLiteDatabase,
  cityDetails: CityDetails,
) => {
  const updateQuery = `
    UPDATE cityDetails
    SET temperature = ?, airQuality = ?, date = ?, weatherDetails = ?
    WHERE cityId = ?  -- Note: Using cityId here instead of cityName
  `;
  const values = [
    cityDetails.temperature,
    cityDetails.airQuality,
    cityDetails.date.toISOString(),
    cityDetails.weatherDetails,
    cityDetails.cityId,
  ];
  try {
    return db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update city details');
  }
};
