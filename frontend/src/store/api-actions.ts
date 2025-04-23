import axios, { AxiosInstance, formToJSON } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { loadInfo, setLoadingStatus, setError, changeCity, loadForecast, loadChartsData10Days, loadChartsData3Days } from './main-process/main-slice.js';
import { AppDispatch, RootState } from '../store';
import { ServerWeatherInfo, ForecastItems, ChartsInfo } from '../types/state/state-types.js';

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

        const forecast = (await api.get<ForecastItems>(`http://localhost:5000/forecast/?${params.toString()}`));
        dispatch(loadForecast(forecast.data));

        const data3Days = (await api.get<ChartsInfo[]>(`http://localhost:5000/3days/?${params.toString()}`));
        dispatch(loadChartsData3Days(data3Days.data));

        const data10Days = (await api.get<ChartsInfo[]>(`http://localhost:5000/10days/?${params.toString()}`));
        dispatch(loadChartsData10Days(data10Days.data));

        dispatch(setLoadingStatus(false));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.status === 400
            ? 'No such city'
            : 'Error while processing';
          toast.error(errorMessage);
          return rejectWithValue(errorMessage);
        }
        toast.error('Unknown error');
        return rejectWithValue('Unknown error');
      } finally {
        // dispatch(setLoadingStatus(false));
      }
    }
  );
