import requests
from dotenv import load_dotenv
import os
from dataclasses import dataclass
from datetime import datetime, timezone
import json
from requests.exceptions import Timeout

load_dotenv()
api_key = os.getenv('keyWeather')

@dataclass
class WeatherData:
    description: str
    temperature: float
    icon: str
    wind_speed: float
    visibility: float
    sunrise: str
    sunset: str
    humidity: int
    pressure: int

def get_lan_lon(API_key, city_name, region):
    if region:
        location = f"{city_name},{region}"
    else:
        location = city_name
    country_name = "RU"
    try:
        resp = requests.get(
            f'http://api.openweathermap.org/geo/1.0/direct?q={location},{country_name}&appid={API_key}',
            timeout=(10, 10)
        )
        if resp.status_code == 200:
            data = resp.json()
            return (data[0].get('lat'), data[0].get('lon'), 200) if data else (None, None, 400)
        else:
            return None, None, resp.status_code
    except Timeout:
        return None, None, 408
    except requests.exceptions.RequestException as e:
        return None, None, 500

def get_current_weather(lat, lon, API_key):
    resp = requests.get(f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_key}&units=metric').json()
    
    data = WeatherData(
        description=resp.get('weather')[0].get('description'),
        icon=resp.get('weather')[0].get('icon'),
        temperature=int(resp.get('main').get('temp')),
        wind_speed=resp.get('wind').get('speed'),
        visibility=resp.get('visibility') / 1000,
        sunrise=datetime.fromtimestamp(resp['sys']['sunrise'], tz=timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z'),
        sunset=datetime.fromtimestamp(resp['sys']['sunset'], tz=timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z'),
        humidity=resp.get('main').get('humidity'),
        pressure=resp.get('main').get('pressure')
    )
    return data


@dataclass
class WeatherForecastData:
    time: str
    temperature: float

def get_weather_forecast(lat, lon, API_key):
    resp = requests.get(f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_key}&units=metric').json()
    forecasts = []
    
    for entry in resp.get('list', [])[:5]:
        forecast = WeatherForecastData(
            temperature=int(entry.get('main').get('temp')),
            time=datetime.fromtimestamp(entry['dt'], tz=timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
        )
        forecasts.append(forecast)
    
    return forecasts

def main(city_name, region):
    lat, lon, status_code = get_lan_lon(api_key, city_name, region)
    if status_code == 200:
        weather_data = get_current_weather(lat, lon, api_key)
        forecast_data = get_weather_forecast(lat, lon, api_key)
        current_weather = {
            "temperature": weather_data.temperature,
            "wind_speed": weather_data.wind_speed,
            "visibility": weather_data.visibility,
            "pressure": weather_data.pressure,
            "humidity": weather_data.humidity,
            "sunrise": weather_data.sunrise,
            "sunset": weather_data.sunset,
            "description": weather_data.description,
            "icon": f"https://openweathermap.org/img/wn/{weather_data.icon}@2x.png"
        }
        current_weather = json.dumps(current_weather, ensure_ascii=False)
        forecast_list = []
        for forecast in forecast_data:

            forecast_list.append({
                "date": forecast.time,
                "temperature": forecast.temperature
            })
        forecasts = json.dumps(forecast_list, ensure_ascii=False)
        return current_weather, forecasts, status_code
    
    return None, None, status_code

