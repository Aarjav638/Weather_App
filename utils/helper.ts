import axios from 'axios';
import {
  getCityDetail,
  updateCityDetails,
  addCityDetails,
} from '../db/Insertcitiesdetials';
import {CityDetails} from '../db/typing';
import {HourlyWeather} from '../constants/types';
import {connectToDatabase} from '../db/db';

export const fetchCityDetails = async () => {
  const db = await connectToDatabase();
  const details = await getCityDetail(db);
  return details;
};

export const updateCity = async (cityDetailsProps: CityDetails) => {
  const db = await connectToDatabase();
  await updateCityDetails(db, cityDetailsProps);
};

export const addCity = async (cityDetailsProps: CityDetails) => {
  const db = await connectToDatabase();
  await addCityDetails(db, cityDetailsProps);
};
export const fetchCityWeatherDetailsFromAPI = async (
  city: string,
  state: string,
  country: string,
) => {
  try {
    const weather_response = await axios.post(
      'https://cjxiaojia.com/api/location',
      {
        city,
        state,
        country,
      },
    );
    return weather_response.data[0];
  } catch (error) {
    console.error('Error fetching weather details from API:', error);
    return null;
  }
};

export const getCurrentTemperature = (hourly: HourlyWeather[] | null) => {
  if (!Array.isArray(hourly)) {
    console.error('Invalid hourly data:', hourly);
    return null;
  }

  const currentHour = new Date().getHours();
  const currentHourData = hourly.find(hourData => {
    const weatherHour = new Date(hourData.time).getHours();
    return weatherHour === currentHour;
  });
  return currentHourData ? currentHourData.temperature : null;
};
export const getCurrentWeatherData = (hourly: HourlyWeather[] | null) => {
  if (!Array.isArray(hourly)) {
    console.error('Invalid hourly data:', hourly);
    return {temperature: null, precipitation_probability: null};
  }

  const currentHour = new Date().getHours();
  const currentHourData = hourly.find(hourData => {
    const weatherHour = new Date(hourData.time).getHours();
    return weatherHour === currentHour;
  });

  if (currentHourData) {
    return {
      temperature: currentHourData.temperature,
      precipitation_probability: currentHourData.precipitation_probability,
    };
  } else {
    return {temperature: null, precipitation_probability: null};
  }
};
