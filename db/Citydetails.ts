import {SQLiteDatabase} from 'react-native-sqlite-storage';

export const createTables = async (db: SQLiteDatabase) => {
  const city = `
      CREATE TABLE IF NOT EXISTS City (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         cityName TEXT NOT NULL,
         state TEXT,
         country TEXT
      )
    `;
  const cityDetails = `
    CREATE TABLE IF NOT EXISTS cityDetails (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       temperature TEXT,
       airQuality TEXT,
       cityId INTEGER,
       city TEXT,
       date DATE,
       weatherDetails TEXT,
       deleted INTEGER DEFAULT 0,
       FOREIGN KEY (cityId) REFERENCES City(id) ON DELETE CASCADE
    )
   `;
  try {
    const result = await db.executeSql(city);
    await db.executeSql(cityDetails);
    console.log(result);
  } catch (error) {
    console.error(error);
    throw Error('Failed to create tables');
  }
};
