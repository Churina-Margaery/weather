import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '../../types/state/state-types';
import { ServerWeatherInfo } from '../../types/state/state-types';
import { extractWeatherInfoFromServer } from '../../utils/adapters';

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
      console.log(action.payload);
      //state.forecast = action.payload.forecast;
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
  setError
} = mainSlice.actions;

export default mainSlice;
