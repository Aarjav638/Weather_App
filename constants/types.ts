export interface location {
  city: string;
  country: string;
  state: string;
}
export interface weatherData {
  location: location;
  current: {
    temp: number;
    weather: {
      description: string;
      icon: string;
    };
    humidity: number;
    wind_speed: number;
    pressure: number;
    sunrise: number;
    sunset: number;
  };
  daily: {
    dt: number;
    temp: {
      max: number;
      min: number;
    };
    weather: {
      description: string;
      icon: string;
    };
  }[];
  hourly: {
    dt: number;
    temp: number;
    weather: {
      description: string;
      icon: string;
    };
  }[];
}
