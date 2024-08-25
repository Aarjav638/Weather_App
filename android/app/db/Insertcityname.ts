import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { City } from './typing';

export const addCityname = async (db: SQLiteDatabase, city: City): Promise<number> => {
    const insertQuery = 'INSERT INTO City (cityName) VALUES (?)';
    try {
        const result = await db.executeSql(insertQuery, [city.cityName]);
        // Return the auto-generated cityId
        return result[0].insertId;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add city');
    }
};

  export const getCityName = async (db: SQLiteDatabase): Promise<City[]> => {
    try {
      const cityname: City[] = [];
      const results = await db.executeSql('SELECT * FROM City');
      results?.forEach((result) => {
        for (let index = 0; index < result.rows.length; index++) {
          cityname.push(result.rows.item(index));
        }
      });
      return cityname;
    } catch (error) {
      console.error(error);
      throw Error('Failed to get name from database');
    }
  };

  // Here is another version if you need to retrieve only one user preference.

// export const getSingleCity = async (
//     db: SQLiteDatabase,
//     city: City
//   ): Promise<string | null> => {
//     const query = `SELECT ${city} FROM UserPreferences WHERE id = ?`;
//     const values = [
//         city.id,
//     ];
//     try {
//       const results = await db.executeSql(query , values);
//       if (results[0]?.rows?.length) {
//         return results[0].rows.item(0)[city.cityName];
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.error(error);
//       throw Error(`Failed to get ${city} from database`);
//     }
//   };
