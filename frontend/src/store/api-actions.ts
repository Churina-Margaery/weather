import axios, { AxiosInstance, formToJSON } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { loadInfo, setLoadingStatus, setError, changeCity, loadForecast } from './main-process/main-slice.js';
import { AppDispatch, RootState } from '../store';
import { ServerWeatherInfo } from '../types/state/state-types.js';

export const fetchWeatherAction = createAsyncThunk<
  void,
  { cityName: string },
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }>(
    'data/fetchWeather',
    async ({ cityName }, { dispatch, extra: api }) => {
      try {
        dispatch(setLoadingStatus(true));

        const params = new URLSearchParams({
          city_name: cityName
        });

        const { data } = await api.get<ServerWeatherInfo>(`http://localhost:5000/?${params.toString()}`);
        console.log(data);
        dispatch(changeCity(cityName));
        dispatch(loadInfo(data));

        //TODO async
        const forecastData = [{ "date": "2025-04-10T15:00:00Z", "temperature": 0 },
        { "date": "2025-04-10T18:00:00Z", "temperature": 2 },
        { "date": "2025-04-10T21:00:00Z", "temperature": 0 },
        { "date": "2025-04-11T00:00:00Z", "temperature": 0 },
        { "date": "2025-04-11T03:00:00Z", "temperature": -3 }];
        dispatch(loadForecast(forecastData));
      } finally {
        dispatch(setLoadingStatus(false));
      }
    }
  );
