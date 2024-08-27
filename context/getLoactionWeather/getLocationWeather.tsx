import React, {createContext, useState, useEffect, useContext} from 'react';
import axios from 'axios';

interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_speed_80m: number[];
}

interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

interface LocationWeatherContextType {
  selectedCity: {city: string; state: string; country: string};
  setSelectedCity: (city: string, state: string, country: string) => void;
  hourlyWeather: HourlyWeather | null;
  dailyWeather: DailyWeather | null;
  loading: boolean;
  error: string | null;
  getCurrentTemperature: () => number | null;
  setLocation: (city: string, state: string, country: string) => void;
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
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather | null>(
    null,
  );
  const [dailyWeather, setDailyWeather] = useState<DailyWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(selectedCity.city, selectedCity.country, selectedCity.state);
    if (selectedCity.city && selectedCity.state && selectedCity.country) {
      console.log('fetching');
      fetchWeather(selectedCity.city, selectedCity.state, selectedCity.country);
    }
  }, [selectedCity]);

  const fetchWeather = async (city: string, state: string, country: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://165.22.215.22/api/location', {
        city,
        state,
        country,
      });
      //   const data = JSON.stringify(response.data);
      //   console.log(data);
      // Assuming the API returns the structure you provided:
      setHourlyWeather(response.data.hourly);
      setDailyWeather(response.data.daily);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };
  const getCurrentTemperature = (): number | null => {
    if (!hourlyWeather) return null;

    const currentHour = new Date().getHours();
    const weatherTimeArray = hourlyWeather.time.map(timeString =>
      new Date(timeString).getHours(),
    );
    const currentHourIndex = weatherTimeArray.indexOf(currentHour);

    return currentHourIndex !== -1
      ? hourlyWeather.temperature_2m[currentHourIndex]
      : null;
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
        error,
        setLocation,
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
