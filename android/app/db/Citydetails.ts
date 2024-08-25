import { SQLiteDatabase } from 'react-native-sqlite-storage';


export const createTables = async (db: SQLiteDatabase) => {
    const city = `
      CREATE TABLE IF NOT EXISTS City (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
          cityName TEXT NOT NULL
      )
    `;
    const cityDetails = `
    CREATE TABLE IF NOT EXISTS cityDetails (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
          temperature TEXT,
          airQuality TEXT,
          cityId INTEGER,
          date   DATE,
          weatherDetails TEXT,
          FOREIGN KEY (cityId) REFERENCES City(id) ON DELETE CASCADE
    )
   `;
    try {
        await db.executeSql(city);
        await db.executeSql(cityDetails);
    } catch (error) {
        console.error(error);
        throw Error('Failed to create tables');
    }
};
