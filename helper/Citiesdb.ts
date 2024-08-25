
import { createTables } from '../android/app/db/Citydetails';
import { useCallback, useEffect } from 'react';
import { connectToDatabase } from '../android/app/db/db';

const Citiesdb = () => {

  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

};

export default Citiesdb;

