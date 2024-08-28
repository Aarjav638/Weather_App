import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {CityDetails} from './typing';

export const addCityDetails = async (
  db: SQLiteDatabase | null,
  cityDetails: CityDetails,
) => {
  try {
    const result = await db?.executeSql(
      `INSERT INTO cityDetails (cityId, temperature, airQuality, date, weatherDetails) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        cityDetails.cityId,
        cityDetails.temperature,
        cityDetails.airQuality,
        cityDetails.date.toISOString(),
        cityDetails.weatherDetails,
      ],
    );
    console.log('City details inserted:', result);
  } catch (error) {
    console.error('Error inserting city details:', error);
  }
};

export const getCityDetail = async (
  db: SQLiteDatabase | null,
): Promise<CityDetails[]> => {
  try {
    console.log('Fetching city details');
    const city: CityDetails[] = [];
    const results = await db?.executeSql('SELECT * FROM cityDetails');
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
  db: SQLiteDatabase | null,
  cityDetails: CityDetails,
): Promise<void> => {
  const updateQuery = `
    UPDATE cityDetails
    SET temperature = ?, airQuality = ?, date = ?, weatherDetails = ?
    WHERE cityId = ?
  `;
  const values = [
    cityDetails.temperature,
    cityDetails.airQuality,
    cityDetails.date.toISOString(),
    cityDetails.weatherDetails,
    cityDetails.cityId,
  ];

  try {
    if (!db) {
      throw new Error('Database connection is not available');
    }
    const result = await db.executeSql(updateQuery, values);

    if (result[0].rowsAffected === 0) {
      throw new Error('No rows were updated');
    }

    console.log('City details updated successfully');
  } catch (error) {
    console.error('Failed to update city details:', error);
    throw error;
  }
};
