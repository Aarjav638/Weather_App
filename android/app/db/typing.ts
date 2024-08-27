export type Table = 'City' | 'cityDetails';
export type CityDetails = {
    temperature: string;
    airQuality: string;
    cityId: number; // Foreign key to City
    date: Date;
    weatherDetails: string;
    id?: number; // Optional, auto-generated primary key
};

export type City = {
    cityName: string;
    state:string;
    country:string;
    id?: number; // Optional, auto-generated primary key if needed
};

