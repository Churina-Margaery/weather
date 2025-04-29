from flask import Flask, jsonify, request
from weather import current_weather, forecast_weather, past_weather, get_spb_weather_from_db
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def get_current_weather():
    city_name = request.args.get('city_name')  
    state_name = request.args.get('state_name', None)  
    country_name = request.args.get('country_name') 

    current, status_code = current_weather(city_name, state_name, country_name)

    if status_code == 200:
        return jsonify(current), 200
    else:
        return jsonify({"detail": "Failed to get weather data"}), status_code

@app.route('/3days/', methods=['GET'])
def get_3_days_weather():
    city_name = request.args.get('city_name')  
    state_name = request.args.get('state_name', None)  
    country_name = request.args.get('country_name')
    
    if city_name.lower() in ['saint-petersburg', 'санкт-петербург', 'спб', 'saint petersburg']:
        data = get_spb_weather_from_db(3)
        if data:
            return jsonify(data), 200
        return jsonify({"detail": "Failed to get SPb weather data"}), 500
    else:
        data, status_code = past_weather(city_name, state_name, country_name, 3)
        if status_code == 200:
            return jsonify(data), 200
        return jsonify({"detail": "Failed to get weather data"}), status_code
    
@app.route('/10days/', methods=['GET'])
def get_10_days_weather():
    city_name = request.args.get('city_name')  
    state_name = request.args.get('state_name', None)  
    country_name = request.args.get('country_name') 

    if city_name.lower() in ['saint-petersburg', 'санкт-петербург', 'спб', 'saint petersburg']:
        data = get_spb_weather_from_db(10)
        if data:
            return jsonify(data), 200
        return jsonify({"detail": "Failed to get SPb weather data"}), 500
    else:
        data, status_code = past_weather(city_name, state_name, country_name, 10)
        if status_code == 200:
            return jsonify(data), 200
        return jsonify({"detail": "Failed to get weather data"}), status_code

@app.route('/forecast/', methods=['GET'])
def get_forecast_weather():
    city_name = request.args.get('city_name')  
    state_name = request.args.get('state_name', None) 
    country_name = request.args.get('country_name')

    forecast, status_code = forecast_weather(city_name, state_name, country_name)

    if status_code == 200:
        return jsonify(forecast), 200  
    else:
        return jsonify({"detail": "Failed to get weather data"}), status_code

if __name__ == '__main__':
    from weather import fetch_and_store_spb_weather
    success = fetch_and_store_spb_weather()
    print("Data fetched and stored:", success)
    app.run(debug=True)
