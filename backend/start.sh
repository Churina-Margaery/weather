#!/bin/sh
echo "Fill the db..."
python app.py
echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:5000 --timeout 120 --workers 2 app:app