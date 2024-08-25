import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { CityDetails } from './typing';

export const getCityDetailsWithCityNames = async (db: SQLiteDatabase): Promise<(CityDetails & { cityName: string })[]> => {
    try {
        const query = `
          SELECT cd.*, c.cityName
          FROM cityDetails cd
          JOIN City c ON cd.cityId = c.id
        `;
        const results = await db.executeSql(query);
        const cityDetails: (CityDetails & { cityName: string })[] = [];
        results.forEach(result => {
            for (let index = 0; index < result.rows.length; index++) {
                cityDetails.push(result.rows.item(index));
            }
        });
        return cityDetails;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get city details');
    }
};
