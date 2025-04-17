import { ServerWeatherInfo, WeatherInfo, ForecastItems } from "../types/state/state-types";

export function extractWeatherInfoFromServer(info: ServerWeatherInfo): WeatherInfo {
  return {
    "Wind speed": info.wind_speed,
    "Visibility": info.visibility,
    "Pressure": info.pressure,
    "Humidity": info.humidity,
    "Sunrise": formatTimeWithoutTZ(info.sunrise),
    "Sunset": formatTimeWithoutTZ(info.sunset),
  }
}

export function extractForecastFromServer(forecast: ForecastItems): ForecastItems {
  return forecast.map(item => ({
    ...item,
    date: formatTimeWithoutTZ(item.date),
  }))
}

export function formatTimeWithoutTZ(isoString: string): string {
  return isoString.slice(0, 19);
};