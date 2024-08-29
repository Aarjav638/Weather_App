import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {CityDetails} from './typing';
export const addCityDetails = async (
  db: SQLiteDatabase | null,
  cityDetails: CityDetails,
) => {
  const insertQuery = `
    INSERT INTO cityDetails (cityId, temperature, airQuality, date, city, weatherDetails, deleted) 
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `;

  try {
    if (!db) {
      throw new Error('Database connection is not available');
    }

    const result = await db.executeSql(insertQuery, [
      cityDetails.cityId,
      cityDetails.temperature,
      cityDetails.airQuality,
      cityDetails.date.toISOString(),
      cityDetails.city,
      cityDetails.weatherDetails,
    ]);

    if (result[0].rowsAffected > 0) {
      console.log('City details inserted successfully:', result);
    } else {
      console.error('City details insertion failed:', result);
    }
  } catch (error) {
    console.error('Error inserting city details:', error);
  }
};

export const getCityDetail = async (
  db: SQLiteDatabase | null,
): Promise<CityDetails[]> => {
  try {
    const city: CityDetails[] = [];
    const results = await db?.executeSql(
      'SELECT * FROM cityDetails WHERE deleted = 0',
    ); // Exclude deleted cities
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

export const markCityAsDeleted = async (
  db: SQLiteDatabase | null,
  id: number,
) => {
  try {
    await db?.executeSql('UPDATE cityDetails SET deleted = 1 WHERE id = ?', [
      id,
    ]);
  } catch (error) {
    console.error('Error marking city as deleted:', error);
    throw error;
  }
};

export const deleteCityFromDB = async (
  db: SQLiteDatabase | null,
  id: number,
) => {
  try {
    await db?.executeSql('DELETE FROM cityDetails WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting city from DB:', error);
    throw error;
  }
};

export const getDeletedCities = async (
  db: SQLiteDatabase | null,
): Promise<CityDetails[]> => {
  try {
    const deletedCities: CityDetails[] = [];
    const results = await db?.executeSql(
      'SELECT * FROM cityDetails WHERE deleted = 1',
    );
    results?.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        deletedCities.push(result.rows.item(index));
      }
    });
    return deletedCities;
  } catch (error) {
    console.error('Error fetching deleted cities:', error);
    throw Error('Failed to get deleted cities from database');
  }
};
