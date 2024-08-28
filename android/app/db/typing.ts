export type CityDetails = {
  temperature: string;
  airQuality: string;
  cityId: number | undefined;
  date: Date;
  city: string | null;
  weatherDetails: string | null;
  deleted?: number;
  id?: number;
};

export type City = {
  cityName: string;
  state: string;
  country: string;
  id?: number;
};
