import requests
from dotenv import load_dotenv
import os
from dataclasses import dataclass
from datetime import datetime, timezone, date, timedelta
from requests.exceptions import Timeout
import pytz
from timezonefinder import TimezoneFinder
from database import Session, WeatherRecord
import sqlalchemy.exc
import time


load_dotenv()
api_key = os.getenv('OW_API_KEY')
api_key_days = os.getenv('VC_API_KEY')

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
    try:
        end_date = date.today()
        start_date = end_date - timedelta(days=days-1)
        
        url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{lat},{lon}/{start_date}/{end_date}?unitGroup=metric&include=days&key={API_key}&contentType=json"
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        weather_data = response.json().get('days', [])
        
        result = []
        for day in weather_data:
            result.append({
                "date": day['datetime'],
                "temperature": day.get('temp', None),
                "wind_speed": round(day.get('windspeed', 0) / 3.6, 1),
                "visibility": day.get('visibility', None),
                "pressure": day.get('pressure', None),
                "humidity": day.get('humidity', None),
            })
        
        return result
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching historical weather data: {str(e)}")
        return None

def fetch_and_store_spb_weather():
    """Попытка обновить данные СПб в БД с обработкой ошибок"""
    from database import engine, Session
    
    if engine is None:
        print("Database engine not available, skipping update")
        return False
    
    session = Session()
    try:
        end_date = date.today()
        start_date = end_date - timedelta(days=30)
        url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Saint%20Petersburg/{start_date}/{end_date}?unitGroup=metric&include=days&key={os.getenv('VC_API_KEY')}&contentType=json"
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        weather_data = response.json().get('days', [])

        existing_dates = {r.date for r in session.query(WeatherRecord.date).filter_by(city='Saint Petersburg').all()}

        for day in weather_data:
            record_date = date.fromisoformat(day['datetime'])
            
            if record_date in existing_dates:
                session.query(WeatherRecord).filter_by(
                    date=record_date,
                    city='Saint Petersburg'
                ).update({
                    'temperature': day['temp'],
                    'wind_speed': round(day['windspeed'] / 3.6, 1),
                    'visibility': day['visibility'],
                    'pressure': day['pressure'],
                    'humidity': day['humidity']
                })
            else:
                new_record = WeatherRecord(
                    date=record_date,
                    temperature=day['temp'],
                    wind_speed=round(day['windspeed'] / 3.6, 1),
                    visibility=day['visibility'],
                    pressure=day['pressure'],
                    humidity=day['humidity'],
                    city='Saint Petersburg'
                )
                session.add(new_record)

        session.commit()
        return True
    except Exception as e:
        session.rollback()
        print(f"Error updating SPb weather: {str(e)}")
        return False
    finally:
        session.close()

def get_spb_weather_from_db(days):
    """Получение данных из базы для СПб с fallback на API"""
    from database import engine, Session
    
    if engine is None:
        print("Database engine not available, falling back to API")
        return get_past_weather_data(59.9343, 30.3351, days, api_key_days)
    
    session = Session()
    try:
        end_date = date.today()
        start_date = end_date - timedelta(days=days-1)
        
        records = session.query(WeatherRecord)\
            .filter(WeatherRecord.city == 'Saint Petersburg')\
            .filter(WeatherRecord.date >= start_date)\
            .filter(WeatherRecord.date <= end_date)\
            .order_by(WeatherRecord.date.asc())\
            .all()
        
        if not records:
            print("No data in DB, falling back to API")
            return get_past_weather_data(59.9343, 30.3351, days, api_key_days)
        
        return [{
            "date": record.date.isoformat(),
            "temperature": record.temperature,
            "wind_speed": record.wind_speed,
            "visibility": record.visibility,
            "pressure": record.pressure,
            "humidity": record.humidity,
        } for record in records]
    except Exception as e:
        print(f"Error fetching SPb weather from DB, falling back to API: {str(e)}")
        return get_past_weather_data(59.9343, 30.3351, days, api_key_days)
    finally:
        session.close()


def past_weather(city_name, region, country_name, days):
    lat, lon, status_code = get_lan_lon(api_key, city_name, region, country_name)
    if status_code == 200:
        return get_past_weather_data(lat, lon, days, api_key_days), 200
    return None, status_code
