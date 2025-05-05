import { store } from '../../store';

export type ForecastItem = {
  date: string;
  temperature: number;
}

export type ForecastItems = ForecastItem[];

export type WeatherChartTypes = "humidity" | "pressure" | "temperature" | "visibility" | "wind_speed";

export type WeatherInfo = {
  "Wind speed": number,
  "Visibility": number,
  "Pressure": number,
  "Humidity": number,
  "Sunrise": string,
  "Sunset": string,
};

export type ChartsInfo = {
  "date": string,
  "humidity": number,
  "pressure": number,
  "temperature": number,
  "visibility": number,
  "wind_speed": number,
};


export type AppState = {
  activeCityName: string;
  date: string;
  temperature: number;
  description: string;
  icon: string;
  weatherInfo: WeatherInfo;
  forecast: ForecastItem[];
  chartsInfo3Days: ChartsInfo[];
  chartsInfo10Days: ChartsInfo[];
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
