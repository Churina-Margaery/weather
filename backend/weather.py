import requests
from dotenv import load_dotenv
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from requests.exceptions import Timeout
import pytz
from timezonefinder import TimezoneFinder


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

def get_lan_lon(API_key, city_name, region, country_name):
    if region:
        location = f"{city_name},{region}"
    else:
        location = city_name
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
    
    tf = TimezoneFinder()
    timezone_str = tf.timezone_at(lat=lat, lng=lon)
    local_tz = pytz.timezone(timezone_str)
    sunrise_utc = datetime.fromtimestamp(resp['sys']['sunrise'], tz=pytz.utc)
    sunset_utc = datetime.fromtimestamp(resp['sys']['sunset'], tz=pytz.utc)

    data = WeatherData(
        description=resp.get('weather')[0].get('description'),
        icon=resp.get('weather')[0].get('icon'),
        temperature=int(resp.get('main').get('temp')),
        wind_speed=resp.get('wind').get('speed'),
        visibility=resp.get('visibility') / 1000,
        sunrise=sunrise_utc.astimezone(local_tz).isoformat(timespec='seconds'),
        sunset=sunset_utc.astimezone(local_tz).isoformat(timespec='seconds'),
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
    
    tf = TimezoneFinder()
    timezone_str = tf.timezone_at(lat=lat, lng=lon)
    local_tz = pytz.timezone(timezone_str)
    
    for entry in resp.get('list', [])[:5]:
        forecast_time_utc = datetime.fromtimestamp(entry['dt'], tz=pytz.utc)
        forecast = WeatherForecastData(
            temperature=int(entry.get('main').get('temp')),
            time=forecast_time_utc.astimezone(local_tz).isoformat(timespec='seconds')
        )
        forecasts.append(forecast)
    
    return forecasts

def current_weather(city_name, region, country_name):
    lat, lon, status_code = get_lan_lon(api_key, city_name, region, country_name)
    if status_code == 200:
        weather_data = get_current_weather(lat, lon, api_key)
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
        return current_weather, status_code
    else:
        return None, status_code
    
def forecast_weather(city_name, region, country_name):
    lat, lon, status_code = get_lan_lon(api_key, city_name, region, country_name)
    if status_code == 200:
        forecast_data = get_weather_forecast(lat, lon, api_key)
        forecast_list = []
        for forecast in forecast_data:
            forecast_list.append({
                "date": forecast.time,
                "temperature": forecast.temperature
            })
        return forecast_list, status_code
    else:
        return None, status_code

def get_past_weather_data(lat, lon, days, API_key):
    # Заглушка с генерацией случайных данных
    from random import randint
    from datetime import timedelta
    
    now = datetime.now()
    result = []

    for i in range(days, 0, -1):  # Изменяем направление цикла
        date = (now - timedelta(days=i)).date().isoformat()  # Вычитаем i дней
        result.append({
            "date": date,
            "temperature": randint(18, 25),
            "wind speed": round(randint(30, 70) / 10, 1),
            "visibility": randint(8, 10),
            "pressure": randint(1008, 1018),
            "humidity": randint(50, 75)
        })

    return result


def past_weather_3days(city_name, region, country_name):
    lat, lon, status_code = get_lan_lon(api_key, city_name, region, country_name)
    if status_code == 200:
        return get_past_weather_data(lat, lon, 3, api_key), 200
    return None, status_code


def past_weather_10days(city_name, region, country_name):
    lat, lon, status_code = get_lan_lon(api_key, city_name, region, country_name)
    if status_code == 200:
        return get_past_weather_data(lat, lon, 10, api_key), 200
    return None, status_code
