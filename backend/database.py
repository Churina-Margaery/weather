from sqlalchemy import create_engine, Column, Integer, Float, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
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
    city = Column(String(50), default='Saint-Petersburg')

DATABASE_URL = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)