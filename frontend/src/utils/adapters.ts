import { ServerWeatherInfo, WeatherInfo } from "../types/state/state-types";

export function extractWeatherInfoFromServer(info: ServerWeatherInfo): WeatherInfo {
  return {
    "Wind speed": info.wind_speed,
    "Visibility": info.visibility,
    "Pressure": info.pressure,
    "Humidity": info.humidity,
    "Sunrise": info.sunrise,
    "Sunset": info.sunset,
  }
}