from flask import Flask, render_template, request
from weather import main as get_weather

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    data = None
    error = None
    if request.method == 'POST':
        location = request.form['cityName']
        parts = location.split(',')
        if len(parts) == 1:
            city = parts[0].strip()
            region = None
        else:
            city = parts[0].strip()
            region = parts[1].strip()
        result, status_code = get_weather(city, region)
        if status_code == 200:
            data = result
        else:
            error = result['error']

    return render_template('index.html', data=data, error=error)

@app.route('/3days/', methods=['GET'])
def three_days():
    try:
        city_name = request.args.get('city_name', '').strip()
        state_name = request.args.get('state_name', '').strip()
        country_name = request.args.get('country_name', '').strip()
        
        if not city_name or not country_name:
            return jsonify({'error': 'city_name and country_name are required parameters'}), 400
        
        logger.info(f"Fetching 3-day weather for {city_name}, {state_name}, {country_name}")
        
        data, status_code = get_past_weather(city_name, state_name, country_name, 3)
        
        if status_code == 200:
            response_data = [{
                'date': item.date,
                'temperature': item.temperature,
                'wind speed': item.wind_speed,
                'visibility': item.visibility,
                'pressure': item.pressure,
                'humidity': item.humidity
            } for item in data]
            return jsonify(response_data), 200
        else:
            return jsonify({'error': 'Failed to get weather data'}), status_code
    except psycopg2.Error as e:
        logger.error(f"Database error in /3days/: {str(e)}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /3days/: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
    
@app.route('/10days/', methods=['GET'])
def ten_days():
    try:
        city_name = request.args.get('city_name', '').strip()
        state_name = request.args.get('state_name', '').strip()
        country_name = request.args.get('country_name', '').strip()
        
        if not city_name or not country_name:
            return jsonify({'error': 'city_name and country_name are required parameters'}), 400
        
        logger.info(f"Fetching 10-day weather for {city_name}, {state_name}, {country_name}")
        
        data, status_code = get_past_weather(city_name, state_name, country_name, 10)
        
        if status_code == 200:
            response_data = [{
                'date': item.date,
                'temperature': item.temperature,
                'wind speed': item.wind_speed,
                'visibility': item.visibility,
                'pressure': item.pressure,
                'humidity': item.humidity
            } for item in data]
            return jsonify(response_data), 200
        else:
            return jsonify({'error': 'Failed to get weather data'}), status_code
    except psycopg2.Error as e:
        logger.error(f"Database error in /10days/: {str(e)}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /10days/: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)
