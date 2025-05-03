from sqlalchemy import create_engine, Column, Integer, Float, String, Date, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from datetime import date
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class WeatherRecord(Base):
    __tablename__ = 'weather_records'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, unique=True, nullable=False)
    temperature = Column(Float)
    wind_speed = Column(Float)
    visibility = Column(Float)
    pressure = Column(Integer)
    humidity = Column(Integer)
    city = Column(String(50), default='Saint Petersburg')

def get_engine():
    try:
        DATABASE_URL = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return engine
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def create_session():
    if engine is None:
        return None
    return Session()

engine = get_engine()
Session = sessionmaker()

if engine is not None:
    try:
        Base.metadata.create_all(engine)
        Session.configure(bind=engine)
        print("Database connection established successfully")
    except OperationalError as e:
        print(f"Failed to create database tables: {e}")
        engine = None
else:
    print("Running in API-only mode (database unavailable)")

def is_database_available():
    return engine is not None