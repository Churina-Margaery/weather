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
    async ({ cityName }, { dispatch, extra: api, rejectWithValue }) => {

      try {
        dispatch(setLoadingStatus(true));

        const params = new URLSearchParams({
          city_name: cityName
        });

        const { data } = await api.get<ServerWeatherInfo>(`http://localhost:5000/?${params.toString()}`);
        dispatch(changeCity(cityName));
        dispatch(loadInfo(data));

        const forecast = (await api.get<ForecastItems>(`http://localhost:5000/forecast?${params.toString()}`));
        dispatch(loadForecast(forecast.data));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.status === 400
            ? 'No such city'
            : 'Error while processing';
          return rejectWithValue(errorMessage);
        }
        return rejectWithValue('Unknown error');
      } finally {
        dispatch(setLoadingStatus(false));
      }
    }
  );
