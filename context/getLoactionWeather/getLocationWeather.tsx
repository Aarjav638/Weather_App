import React, {createContext, useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {
  addCityDetails,
  getCityDetail,
  updateCityDetails,
} from '../../db/Insertcitiesdetials';
import {addCityname, getCityName} from '../../db/Insertcityname';
import {createTables} from '../../db/Citydetails';
import {
  ForecastData,
  DailyWeather,
  HourlyWeather,
  location,
} from '../../constants/types';
import {useDatabase} from '../../hooks/useDataBase'; // Custom hook to manage DB connection

interface LocationWeatherContextType {
  selectedCity: location;
  setSelectedCity: (city: string, state: string, country: string) => void;
  hourlyWeather: HourlyWeather[] | null;
  dailyWeather: DailyWeather | null;
  loading: boolean;
  error: string | null;
  db: SQLiteDatabase | null;
  syncCityWeatherDetails: () => void;
  getCurrentTemperature: () => number | null;
  forecastData: ForecastData[] | null;
}

const LocationWeatherContext = createContext<
  LocationWeatherContextType | undefined
>(undefined);

export const LocationWeatherProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {db, loading: dbLoading, error: dbError} = useDatabase();
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

  useEffect(() => {
    if (dbLoading) {
      return;
    } // Wait until the database is fully loaded

    if (dbError) {
      console.error('Database error:', dbError);
      setError('Database connection failed');
      return;
    }

    const initializeCity = async () => {
      if (!db) {
        console.error('Database connection is not available');
        return;
      }

      try {
        // Create tables if they don't exist
        await createTables(db);

        // Check if the initial city exists in the database
        const cityDetails = await getCityDetail(db);
        const cityExists = cityDetails.some(detail => {
          const cityInfo = detail.city ? JSON.parse(detail.city) : null;
          return (
            cityInfo.city === selectedCity.city &&
            cityInfo.state === selectedCity.state &&
            cityInfo.country === selectedCity.country
          );
        });

        if (!cityExists) {
          console.log('Initial city not found in DB, fetching from API');
          await fetchWeatherFromAPI(
            selectedCity.city,
            selectedCity.state,
            selectedCity.country,
          );
        } else {
          console.log('Initial city already exists in DB');
          await fetchWeatherData(
            selectedCity.city,
            selectedCity.state,
            selectedCity.country,
          );
        }
      } catch (catchError) {
        console.error('Failed to initialize city:', catchError);
        setError('Failed to initialize city data');
      }
    };

    initializeCity();
  }, [db, dbLoading, dbError]);

  useEffect(() => {
    if (selectedCity.city && selectedCity.state && selectedCity.country) {
      fetchWeatherData(
        selectedCity.city,
        selectedCity.state,
        selectedCity.country,
      );
    }
  }, [selectedCity]);

  const fetchWeatherData = async (
    city: string,
    state: string,
    country: string,
  ) => {
    if (!db) {
      console.error('Database connection is not available');
      return;
    }

    setLoading(true);
    try {
      const cityDetails = await getCityDetail(db);
      if (cityDetails && cityDetails.length > 0) {
        const cityDetail = cityDetails.find(detail => {
          const cityInfo = detail.city ? JSON.parse(detail.city) : null;
          console.log('cityInfo:', cityInfo);
          return (
            cityInfo.city === city &&
            cityInfo.state === state &&
            cityInfo.country === country
          );
        });

        if (cityDetail) {
          const weatherDetails = cityDetail.weatherDetails
            ? JSON.parse(cityDetail.weatherDetails)
            : null;
          setHourlyWeather(weatherDetails.hourly || null);
          setDailyWeather(weatherDetails.daily || null);
          setError(null);
          console.log('Data loaded from the database');
        } else {
          await fetchWeatherFromAPI(city, state, country);
        }
      } else {
        await fetchWeatherFromAPI(city, state, country);
      }

      // Always fetch forecast data regardless of where the weather data is sourced from
      await fetchForecastData(city, state, country);
    } catch (err) {
      console.error('Failed to load weather data:', err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherFromAPI = async (
    city: string,
    state: string,
    country: string,
  ) => {
    if (!db) {
      console.error('Database connection is not available');
      return;
    }

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

        // Check if city already exists in the database
        const existingCities = await getCityName(db);
        const existingCity = existingCities.find(
          existingCity1 =>
            existingCity1.city === city &&
            existingCity1.state === state &&
            existingCity1.country === country,
        );

        if (existingCity) {
          console.log('City already exists, updating details...');
          await updateCityDetails(db, {
            cityId: existingCity.id,
            temperature: weatherData.hourly[0].temperature.toString(),
            airQuality: 'N/A',
            date: new Date(),
            city: JSON.stringify({city, state, country}),
            weatherDetails: JSON.stringify({
              hourly: weatherData.hourly,
              daily: weatherData.daily,
            }),
          });
        } else {
          console.log('City does not exist, adding new entry...');
          const cityId = await addCityname(db, {
            city: city,
            state,
            country,
          });
          console.log('cityId:', cityId);
          await addCityDetails(db, {
            cityId,
            temperature: weatherData.hourly[0].temperature.toString(),
            airQuality: 'N/A',
            date: new Date(),
            city: JSON.stringify({city, state, country}),
            weatherDetails: JSON.stringify({
              hourly: weatherData.hourly,
              daily: weatherData.daily,
            }),
          });
        }
        setError(null);
      } else {
        setError('Unexpected response structure');
      }
    } catch (err) {
      console.error('Failed to fetch weather data from API:', err);
      setError('Failed to fetch weather data from API');
    }
  };

  const fetchForecastData = async (
    city: string,
    state: string,
    country: string,
  ) => {
    try {
      const response = await axios.post('https://cjxiaojia.com/api/forecast', {
        city,
        state,
        country,
      });

      const forecastData = response.data[0];
      if (forecastData && forecastData.daily) {
        setDailyForeCast(forecastData.daily);
        setError(null);
      } else {
        setError('Unexpected response structure');
      }
    } catch (err) {
      setError('Failed to fetch forecast data');
    }
  };

  const syncCityWeatherDetails = async () => {
    if (!db) {
      console.error('Database connection is not available');
      return;
    }

    try {
      const cityDetails = await getCityDetail(db);
      if (cityDetails && cityDetails.length > 0) {
        const cityDetail = cityDetails.find(detail => {
          const cityInfo = detail.city ? JSON.parse(detail.city) : null;
          return (
            cityInfo.cityName === selectedCity.city &&
            cityInfo.state === selectedCity.state &&
            cityInfo.country === selectedCity.country
          );
        });

        if (cityDetail) {
          const weatherDetails = cityDetail.weatherDetails
            ? JSON.parse(cityDetail.weatherDetails).hourly
            : null;
          setHourlyWeather(weatherDetails);
        }
      }

      // Always sync forecast data
      await fetchForecastData(
        selectedCity.city,
        selectedCity.state,
        selectedCity.country,
      );
    } catch (catchError) {
      console.error('Failed to sync city weather details:', catchError);
    }
  };

  // Sync cityWeather and forecast data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      syncCityWeatherDetails();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <LocationWeatherContext.Provider
      value={{
        selectedCity,
        setSelectedCity: (city, state, country) =>
          setSelectedCity({city, state, country}),
        hourlyWeather,
        dailyWeather,
        loading,
        syncCityWeatherDetails,
        db,
        error,
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
