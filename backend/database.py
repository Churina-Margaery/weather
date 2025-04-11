# database.py
import psycopg2
from psycopg2 import sql
from datetime import datetime, timedelta
from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()

@dataclass
class PastWeatherData:
    date: str
    temperature: float
    wind_speed: float
    visibility: float
    pressure: int
    humidity: int

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT', '5432')
    )

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS past_weather (
        id SERIAL PRIMARY KEY,
        city_name TEXT NOT NULL,
        state_name TEXT,
        country_name TEXT NOT NULL,
        date DATE NOT NULL,
        temperature DECIMAL(5,2) NOT NULL,
        wind_speed DECIMAL(5,2) NOT NULL,
        visibility DECIMAL(5,2) NOT NULL,
        pressure INTEGER NOT NULL,
        humidity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_weather_record UNIQUE (city_name, state_name, country_name, date)
    )
    ''')
    
    conn.commit()
    conn.close()

def save_weather_data(city_name, state_name, country_name, weather_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    for data in weather_data:
        cursor.execute('''
        INSERT INTO past_weather 
        (city_name, state_name, country_name, date, temperature, wind_speed, visibility, pressure, humidity)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT ON CONSTRAINT unique_weather_record 
        DO UPDATE SET
            temperature = EXCLUDED.temperature,
            wind_speed = EXCLUDED.wind_speed,
            visibility = EXCLUDED.visibility,
            pressure = EXCLUDED.pressure,
            humidity = EXCLUDED.humidity,
            created_at = CURRENT_TIMESTAMP
        ''', (
            city_name,
            state_name,
            country_name,
            data.date,
            data.temperature,
            data.wind_speed,
            data.visibility,
            data.pressure,
            data.humidity
        ))
    
    conn.commit()
    conn.close()

def get_weather_data(city_name, state_name, country_name, days):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days-1)
    
    query = sql.SQL('''
    SELECT date, temperature, wind_speed, visibility, pressure, humidity
    FROM past_weather
    WHERE city_name = %s AND country_name = %s 
    ''')
    
    params = [city_name, country_name]
    
    if state_name:
        query = sql.SQL('{} AND state_name = %s').format(query)
        params.append(state_name)
    
    query = sql.SQL('{} AND date BETWEEN %s AND %s ORDER BY date DESC LIMIT %s').format(query)
    params.extend([start_date, end_date, days])
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    return [PastWeatherData(
        date=row[0].isoformat(),
        temperature=float(row[1]),
        wind_speed=float(row[2]),
        visibility=float(row[3]),
        pressure=int(row[4]),
        humidity=int(row[5])
    ) for row in rows]

# Инициализируем базу данных при импорте
init_db()