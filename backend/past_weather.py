# past_weather.py
import requests
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from database import save_weather_data, PastWeatherData
import psycopg2

load_dotenv()
api_key = os.getenv('keyWeather')

def get_past_weather_from_api(lat, lon, days):
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    # OpenWeatherMap Historical API (нужен платный тариф)
    # Для примера используем текущие данные
    resp = requests.get(
        f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric'
    ).json()
    
    # В реальном приложении здесь должен быть запрос к историческому API
    # Для демонстрации создадим искусственные данные
    weather_data = []
    for i in range(days):
        date = (end_date - timedelta(days=i)).isoformat()
        weather_data.append(PastWeatherData(
            date=date,
            temperature=resp.get('main', {}).get('temp', 0) + i - 2,
            wind_speed=resp.get('wind', {}).get('speed', 0) + i * 0.3,
            visibility=(resp.get('visibility', 10000) / 1000) - i * 0.5,
            pressure=resp.get('main', {}).get('pressure', 1013) + i,
            humidity=resp.get('main', {}).get('humidity', 50) + i * 5
        ))
    
    return weather_data

def get_past_weather(city_name, state_name, country_name, days):
    try:
        # Сначала проверяем есть ли данные в базе
        db_data = get_weather_data(city_name, state_name, country_name, days)
        
        if len(db_data) >= days:
            return db_data, 200
        
        # Если данных нет, получаем их из API
        lat, lon, status_code = get_lan_lon(api_key, city_name, state_name, country_name)
        if status_code != 200:
            return None, status_code
        
        api_data = get_past_weather_from_api(lat, lon, days)
        
        # Сохраняем полученные данные в базу
        save_weather_data(city_name, state_name, country_name, api_data)
        
        return api_data, 200
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        # В случае ошибки БД, пытаемся получить данные только из API
        lat, lon, status_code = get_lan_lon(api_key, city_name, state_name, country_name)
        if status_code != 200:
            return None, status_code
        return get_past_weather_from_api(lat, lon, days), 200

def get_lan_lon(api_key, city_name, state_name, country_name):
    location = f"{city_name},{state_name}" if state_name else city_name
    resp = requests.get(
        f'http://api.openweathermap.org/geo/1.0/direct?q={location},{country_name}&appid={api_key}'
    )
    
    if resp.status_code == 200:
        data = resp.json()
        return (data[0].get('lat'), data[0].get('lon'), 200) if data else (None, None, 201)
    else:
        return None, None, resp.status_code