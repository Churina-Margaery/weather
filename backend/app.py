from flask import Flask, render_template, request
from weather import main as get_weather
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    data = None
    error = None
       
    if request.method == "GET":
        city = request.args.get('city_name', '').strip()
        region = request.args.get('state_name', '').strip() or None
        print(str(get_weather(city, region)))
        
        return str(get_weather(city, region)[0])

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
