import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {useEffect, useState} from 'react';
import {connectToDatabase} from '../db/db'; // Replace with your actual database connection file

export const useDatabase = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const dbConnection = await connectToDatabase();
        setDb(dbConnection);
        setLoading(false);
      } catch (err) {
        console.error('Failed to connect to database:', err);
        setError('Failed to connect to database');
        setLoading(false);
      }
    };

    initDB();
  }, []);

  return {db, loading, error};
};
