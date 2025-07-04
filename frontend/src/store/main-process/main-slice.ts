import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState, ForecastItems, ChartsInfo } from '../../types/state/state-types';
import { ServerWeatherInfo } from '../../types/state/state-types';
import { extractWeatherInfoFromServer, extractForecastFromServer } from '../../utils/adapters';

const initialState: AppState = {
  activeCityName: 'Saint-Petersburg',
  date: Date(),
  temperature: 0,
  description: '',
  icon: '',
  weatherInfo: {
    "Wind speed": 0,
    "Visibility": 0,
    "Pressure": 0,
    "Humidity": 0,
    "Sunrise": Date(),
    "Sunset": Date(),
  },
  forecast: [],
  chartsInfo3Days: [],
  chartsInfo10Days: [],
  darkTheme: false,
  isLoading: true,
  isError: false,
};


export const mainSlice = createSlice({
  name: 'Main',
  initialState,
  reducers: {
    loadInfo: (state, action: PayloadAction<ServerWeatherInfo>) => {
      state.date = Date();
      state.temperature = action.payload.temperature;
      state.weatherInfo = extractWeatherInfoFromServer(action.payload);
      state.description = action.payload.description;
      state.icon = action.payload.icon;
    },
    loadForecast: (state, action: PayloadAction<ForecastItems>) => {
      state.forecast = extractForecastFromServer(action.payload);
    },
    loadChartsData3Days: (state, action: PayloadAction<ChartsInfo[]>) => {
      state.chartsInfo3Days = action.payload;
    },
    loadChartsData10Days: (state, action: PayloadAction<ChartsInfo[]>) => {
      state.chartsInfo10Days = action.payload;
    },
    setLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    changeCity: (state, action: PayloadAction<string>) => {
      state.activeCityName = action.payload;
    },
    toggleTheme: (state) => {
      state.darkTheme = !state.darkTheme;
    },
    setError: (state) => {
      state.isError = true;
    },
  },
});

export const {
  loadInfo,
  changeCity,
  toggleTheme,
  setLoadingStatus,
  setError,
  loadForecast,
  loadChartsData3Days,
  loadChartsData10Days
} = mainSlice.actions;

export default mainSlice;
