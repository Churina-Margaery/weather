from flask import Flask, jsonify, request
from weather import (
    current_weather,
    forecast_weather,
    past_weather,
    get_spb_weather_from_db,
)
from flask_cors import CORS
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    supports_credentials=False,
)


def create_empty_weather_data(days):
    """Создает пустые данные для указанного количества дней"""
    empty_data = []
    for i in range(days):
        date = (datetime.now() - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
        empty_data.append(
            {
                "date": date,
                "temperature": 0,
                "wind_speed": 0,
                "visibility": 0,
                "pressure": 0,
                "humidity": 0,
            }
        )
    return empty_data


@app.route("/", methods=["GET"])
def get_current_weather():
    city_name = request.args.get("city_name")
    state_name = request.args.get("state_name", None)
    country_name = request.args.get("country_name")

    try:
        current, status_code = current_weather(city_name, state_name, country_name)

        if status_code == 200 and current is not None:
            return jsonify(current), 200
        else:
            # Возвращаем пустые данные для текущей погоды
            empty_current = {
                "temperature": 0,
                "wind_speed": 0,
                "visibility": 0,
                "pressure": 0,
                "humidity": 0,
                "sunrise": datetime.now().isoformat(),
                "sunset": datetime.now().isoformat(),
                "description": "No data available",
                "icon": "",
            }
            return jsonify(empty_current), 200
    except Exception as e:
        print(f"Error in current weather: {e}")
        empty_current = {
            "temperature": 0,
            "wind_speed": 0,
            "visibility": 0,
            "pressure": 0,
            "humidity": 0,
            "sunrise": datetime.now().isoformat(),
            "sunset": datetime.now().isoformat(),
            "description": "No data available",
            "icon": "",
        }
        return jsonify(empty_current), 200


@app.route("/3days/", methods=["GET"])
def get_3_days_weather():
    city_name = request.args.get("city_name")
    state_name = request.args.get("state_name", None)
    country_name = request.args.get("country_name")

    try:
        data = None
        if city_name and city_name.lower() in [
            "saint-petersburg",
            "санкт-петербург",
            "спб",
            "saint petersburg",
        ]:
            data = get_spb_weather_from_db(3)

        if not data:
            data, status_code = past_weather(city_name, state_name, country_name, 3)
            if status_code != 200 or not data:
                data = create_empty_weather_data(3)

        return jsonify(data), 200
    except Exception as e:
        print(f"Error in 3days weather: {e}")
        return jsonify(create_empty_weather_data(3)), 200


@app.route("/10days/", methods=["GET"])
def get_10_days_weather():
    city_name = request.args.get("city_name")
    state_name = request.args.get("state_name", None)
    country_name = request.args.get("country_name")

    try:
        data = None
        if city_name and city_name.lower() in [
            "saint-petersburg",
            "санкт-петербург",
            "спб",
            "saint petersburg",
        ]:
            data = get_spb_weather_from_db(10)

        if not data:
            data, status_code = past_weather(city_name, state_name, country_name, 10)
            if status_code != 200 or not data:
                data = create_empty_weather_data(10)

        return jsonify(data), 200
    except Exception as e:
        print(f"Error in 10days weather: {e}")
        return jsonify(create_empty_weather_data(10)), 200


@app.route("/forecast/", methods=["GET"])
def get_forecast_weather():
    city_name = request.args.get("city_name")
    state_name = request.args.get("state_name", None)
    country_name = request.args.get("country_name")

    try:
        forecast, status_code = forecast_weather(city_name, state_name, country_name)

        if status_code == 200 and forecast is not None:
            return jsonify(forecast), 200
        else:
            # Создаем пустой прогноз на 5 периодов
            empty_forecast = []
            for i in range(5):
                time = (datetime.now() + timedelta(hours=3 * i)).isoformat()
                empty_forecast.append({"date": time, "temperature": 0})
            return jsonify(empty_forecast), 200
    except Exception as e:
        print(f"Error in forecast weather: {e}")
        empty_forecast = []
        for i in range(5):
            time = (datetime.now() + timedelta(hours=3 * i)).isoformat()
            empty_forecast.append({"date": time, "temperature": 0})
        return jsonify(empty_forecast), 200


if __name__ == "__main__":
    try:
        from weather import fetch_and_store_spb_weather

        success = fetch_and_store_spb_weather()
        print("Data fetched and stored:", success)
    except Exception as e:
        print(f"Error fetching initial data: {e}")

    app.run(debug=True, host="0.0.0.0", port=5000)
