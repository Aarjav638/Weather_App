import {
    enablePromise,
    openDatabase,
    SQLiteDatabase,
  } from 'react-native-sqlite-storage';
import { Table } from './typing';

  // Enable promise for SQLite
enablePromise(true);

export const connectToDatabase = async () => {
  return openDatabase(
    { name: 'ClimaVista.db', location: 'default' },
    () => {},
    (error) => {
      console.error(error);
      throw Error('Could not connect to database');
    }
  );
};

export const getTableNames = async (db: SQLiteDatabase): Promise<string[]> => {
    try {
      const tableNames: string[] = [];
      const results = await db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );
      results?.forEach((result) => {
        for (let index = 0; index < result.rows.length; index++) {
          tableNames.push(result.rows.item(index).name);
        }
      });
      return tableNames;
    } catch (error) {
      console.error(error);
      throw Error('Failed to get table names from database');
    }
  };

  export const removeTable = async (db: SQLiteDatabase, tableName: Table) => {
    const query = `DROP TABLE IF EXISTS ${tableName}`;
    try {
      await db.executeSql(query);
    } catch (error) {
      console.error(error);
      throw Error(`Failed to drop table ${tableName}`);
    }
  };
