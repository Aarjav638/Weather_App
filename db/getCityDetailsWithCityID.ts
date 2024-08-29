import {SQLiteDatabase} from 'react-native-sqlite-storage';
export const getCityDetailsById = async (
  db: SQLiteDatabase,
  cityId: number,
) => {
  try {
    const result = await db.executeSql(
      'SELECT * FROM cityDetails WHERE cityId = ?',
      [cityId],
    );
    if (result[0].rows.length > 0) {
      const item = result[0].rows.item(0);
      console.log('City details fetched:', item);
      return {
        temperature: item.temperature,
        airQuality: item.airQuality,
        cityId: item.cityId,
        date: new Date(item.date),
        weatherDetails: item.weatherDetails,
      };
    } else {
      console.log('No city details found for cityId:', cityId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching city details:', error);
    return null;
  }
};
