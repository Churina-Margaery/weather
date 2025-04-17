import { State } from "../../types/state/state-types";
import { WeatherInfo } from "../../types/state/state-types";
import { ForecastItem } from "../../types/state/state-types";

export const getCity = (state: State): string => state['Main'].activeCityName;
export const getDate = (state: State): string => state['Main'].date;
export const getTemp = (state: State): number => state['Main'].temperature;
export const getInfo = (state: State): WeatherInfo => state['Main'].weatherInfo;
export const getForecast = (state: State): ForecastItem[] => state['Main'].forecast;
export const getIsLoading = (state: State): boolean => state['Main'].isLoading;
export const getIsDarkTheme = (state: State): boolean => state['Main'].darkTheme;
export const getDescription = (state: State): string => state['Main'].description;
export const getIcon = (state: State): string => state['Main'].icon;
