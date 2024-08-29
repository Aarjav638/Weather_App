export interface location {
  city: string;
  country: string;
  state: string;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  humidity: number;
  precipitation_probability: number;
  precipitation: number;
  visibility: number;
  wind_speed_10m: number;
  wind_speed_80m: number;
}

export interface DailyWeather {
  date: string;
  max_temperature: number;
  min_temperature: number;
  sunrise: string;
  sunset: string;
  uv_index_max: number;
}

export interface ForecastData {
  time: string;
  temprature_2m: number;
}
