import { store } from '../../store';

export type ForecastItem = {
  date: string;
  temperature: number;
}

export type ForecastItems = ForecastItem[];

export type WeatherInfo = {
  "Wind speed": number,
  "Visibility": number,
  "Pressure": number,
  "Humidity": number,
  "Sunrise": string,
  "Sunset": string,
};

export type AppState = {
  activeCityName: string;
  date: string;
  temperature: number;
  description: string;
  icon: string;
  weatherInfo: WeatherInfo;
  forecast: ForecastItem[];
  darkTheme: boolean;
  isLoading: boolean;
  isError: boolean;
}

export type ServerWeatherInfo = {
  temperature: number,
  wind_speed: number,
  visibility: number,
  pressure: number,
  humidity: number,
  sunrise: string,
  sunset: string,
  description: string,
  icon: string
};

export type State = ReturnType<typeof store.getState>;
