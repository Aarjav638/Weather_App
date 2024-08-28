import React, {createContext, useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {connectToDatabase} from '../../android/app/db/db';
import {createTables} from '../../android/app/db/Citydetails';

interface HourlyWeather {
  time: string;
  temperature: number;
  humidity: number;
  precipitation_probability: number;
  precipitation: number;
  visibility: number;
  wind_speed_10m: number;
  wind_speed_80m: number;
}

interface DailyWeather {
  date: string;
  max_temperature: number;
  min_temperature: number;
  sunrise: string;
  sunset: string;
  uv_index_max: number;
}
interface ForecastData {
  time: string;
  temprature_2m: number;
}

interface LocationWeatherContextType {
  selectedCity: {city: string; state: string; country: string};
  setSelectedCity: (city: string, state: string, country: string) => void;
  hourlyWeather: HourlyWeather[] | null;
  dailyWeather: DailyWeather | null;
  loading: boolean;
  error: string | null;
  db: SQLiteDatabase | null;
  getCurrentTemperature: () => number | null;
  setLocation: (city: string, state: string, country: string) => void;
  forecastData: ForecastData[] | null;
}

const LocationWeatherContext = createContext<
  LocationWeatherContextType | undefined
>(undefined);

export const LocationWeatherProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [selectedCity, setSelectedCity] = useState<{
    city: string;
    state: string;
    country: string;
  }>({
    city: 'Kairana',
    state: 'Uttar Pradesh',
    country: 'India',
  });

  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather[] | null>(
    null,
  );

  const [dailyWeather, setDailyWeather] = useState<DailyWeather | null>(null);
  const [dailyForeCast, setDailyForeCast] = useState<ForecastData[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    addTables();
  }, []);

  useEffect(() => {
    console.log(selectedCity.city, selectedCity.country, selectedCity.state);
    if (selectedCity.city && selectedCity.state && selectedCity.country) {
      console.log('fetching');
      fetchWeather(selectedCity.city, selectedCity.state, selectedCity.country);
      fetchForeCast(
        selectedCity.city,
        selectedCity.state,
        selectedCity.country,
      );
    }
  }, [selectedCity]);

  const fetchWeather = async (city: string, state: string, country: string) => {
    setLoading(true);
    try {
      const response = await axios.post('https://cjxiaojia.com/api/location', {
        city,
        state,
        country,
      });

      const weatherData = response.data[0];

      if (weatherData && weatherData.hourly && weatherData.daily) {
        setHourlyWeather(weatherData.hourly);
        setDailyWeather(weatherData.daily);
        setError(null);
      } else {
        setError('Unexpected response structure');
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };
  const fetchForeCast = async (
    city: string,
    state: string,
    country: string,
  ) => {
    setLoading(true);
    try {
      const response = await axios.post('https://cjxiaojia.com/api/forecast', {
        city,
        state,
        country,
      });

      const weatherData = response.data[0];

      if (weatherData && weatherData.daily) {
        setDailyForeCast(weatherData.daily);
        setError(null);
      } else {
        setError('Unexpected response structure');
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const addTables = async () => {
    try {
      const dbb = await connectToDatabase();
      if (dbb) {
        console.log('Database connected');
        setDb(dbb);
        await createTables(dbb);
        console.log('Tables created');
      }
    } catch (catchError) {
      console.error('Error connecting to database:', catchError);
    }
  };

  const getCurrentTemperature = (): number | null => {
    if (!hourlyWeather || hourlyWeather.length === 0) {
      return null;
    }

    const currentHour = new Date().getHours();

    const currentHourData = hourlyWeather.find(hourData => {
      const weatherHour = new Date(hourData.time).getHours();
      return weatherHour === currentHour;
    });

    return currentHourData ? currentHourData.temperature : null;
  };

  const setLocation = (city: string, state: string, country: string) => {
    setSelectedCity({city, state, country});
  };

  return (
    <LocationWeatherContext.Provider
      value={{
        selectedCity,
        setSelectedCity: (city, state, country) =>
          setSelectedCity({city, state, country}),
        hourlyWeather,
        dailyWeather,
        loading,
        db,
        error,
        setLocation,
        forecastData: dailyForeCast,
        getCurrentTemperature,
      }}>
      {children}
    </LocationWeatherContext.Provider>
  );
};

export const useLocationWeather = (): LocationWeatherContextType => {
  const context = useContext(LocationWeatherContext);
  if (!context) {
    throw new Error(
      'useLocationWeather must be used within a LocationWeatherProvider',
    );
  }
  return context;
};
