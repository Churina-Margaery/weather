import axios, { AxiosInstance, formToJSON } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { loadInfo, setLoadingStatus, setError, changeCity, loadForecast } from './main-process/main-slice.js';
import { AppDispatch, RootState } from '../store';
import { ServerWeatherInfo, ForecastItems } from '../types/state/state-types.js';

export const fetchWeatherAction = createAsyncThunk<
  void,
  { cityName: string, stateName: string, countryName: string },
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

        const forecast = (await api.get<ForecastItems>(`http://localhost:5000/forecast?${params.toString()}`));
        console.log(forecast.data);
        dispatch(loadForecast(forecast.data));
      } finally {
        dispatch(setLoadingStatus(false));
      }
    }
  );
