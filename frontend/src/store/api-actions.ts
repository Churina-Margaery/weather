import axios, { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { loadInfo, setLoadingStatus, setError, changeCity } from './main-process/main-slice.js';
import { ForecastItem } from '../types/state/state-types.js';
import { AppDispatch, RootState } from '../store';
import { ServerWeatherInfo } from '../types/state/state-types.js';

// export const setFavoriteStatusAction = createAsyncThunk<void, { offerId: OfferId; isFavorite: number }, {
//   dispatch: AppDispatch;
//   state: State;
//   extra: AxiosInstance;
// }>(
//   'data/setFavoriteStatus',
//   async ({ offerId, isFavorite }, { dispatch, extra: api }) => {
//     const { data } = await api.post<Offer>(
//       `${APIRoute.Favorite}/${offerId}/${isFavorite}`,
//       null
//     );
//     dispatch(favoriteOfferChange(data));
//   },
// );

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
        // await api.get('/fake-endpoint');

        // const elem: ForecastItem = {
        //   date: new Date().toISOString(),
        //   temperature: 18
        // };

        const params = new URLSearchParams({
          city_name: cityName
        });

        const { data } = await api.get<ServerWeatherInfo>(`http://localhost:5000/?${params.toString()}`);
        console.log(data);
        dispatch(changeCity(cityName));
        dispatch(loadInfo(data));

        // dispatch(loadInfo({
        //   activeCityName: 'Saint-Petersburg',
        //   date: new Date().toISOString(),
        //   temperature: 18,
        //   weatherInfo: {
        //     "Wind speed": 2,
        //     "Visibility": 10,
        //     "Pressure": 1008,
        //     "Humidity": 68,
        //     "Sunrise": new Date().toISOString(),
        //     "Sunset": new Date().toISOString(),
        //   },
        //   forecast: Array(5).fill(elem),
        // }));
      } finally {
        dispatch(setLoadingStatus(false));
      }
    }
  );
// interface WeatherData {
//   activeCityName: string;
//   date: string;
//   temperature: number;
//   weatherInfo: {
//     "Wind speed": number;
//     "Visibility": number;
//     "Pressure": number;
//     "Humidity": number;
//     "Sunrise": string;
//     "Sunset": string;
//   };
//   forecast: ForecastItem[];
// }

// function transformWeatherData(
//   apiResponse: any,
//   cityName: string
// ): WeatherData {
//   const hourly = apiResponse.hourly;
//   const daily = apiResponse.daily;

//   const formatTime = (isoString: string) =>
//     new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   return {
//     activeCityName: cityName,
//     date: new Date().toLocaleDateString(),
//     temperature: hourly.temperature_2m[0],
//     weatherInfo: {
//       "Wind speed": hourly.wind_speed_10m[0],
//       "Visibility": hourly.visibility[0],
//       "Pressure": hourly.pressure_msl[0],
//       "Humidity": hourly.relative_humidity_2m[0],
//       "Sunrise": formatTime(daily.sunrise[0]),
//       "Sunset": formatTime(daily.sunset[0])
//     },
//     forecast: hourly.time.map((time: string, index: number) => ({
//       time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       temperature: hourly.temperature_2m[index],
//       humidity: hourly.relative_humidity_2m[index]
//     })).slice(0, 24)
//   };
// }

// export async function fetchWeatherAction() {
//   try {
//     const url = new URL('https://api.open-meteo.com/v1/forecast');
//     const params = {
//       latitude: 52.52,
//       longitude: 13.41,
//       hourly: 'temperature_2m,relative_humidity_2m,visibility,wind_speed_10m,pressure_msl',
//       daily: 'sunrise,sunset',
//       timezone: 'auto',
//       forecast_days: 1
//     };

//     url.search = new URLSearchParams(params).toString();

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       mode: 'cors'
//     });

//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//     const data = await response.json();
//     console.log('Received data:', transformWeatherData(data, 'London'));
//     return data;
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// }



// export const setFavoriteStatusAction = createAsyncThunk<void, { offerId: OfferId; isFavorite: number }, {
//   dispatch: AppDispatch;
//   state: State;
//   extra: AxiosInstance;
// }>(
//   'data/setFavoriteStatus',
//   async ({ offerId, isFavorite }, { dispatch, extra: api }) => {
//     const { data } = await api.post<Offer>(
//       `${APIRoute.Favorite}/${offerId}/${isFavorite}`,
//       null
//     );
//     dispatch(favoriteOfferChange(data));
//   },
// );
