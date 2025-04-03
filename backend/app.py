from flask import Flask, render_template, request
from weather import main as get_weather

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    data = None
    error = None
    if request.method == 'POST':
        city, _, region = request.form['cityName'].strip().partition(',')
        city = city.strip()
        region = region.strip() if region else None
        try:
            current_weather_json, forecast_json, status_code = get_weather(city, region)
        except (ValueError, TypeError):
            status_code = get_weather(city, region)
            current_weather_json = forecast_json = None
        
        #print(current_weather_json, forecast_json, status_code)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
