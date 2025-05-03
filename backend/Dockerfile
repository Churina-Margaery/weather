FROM python:3.13-alpine

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

RUN pip install gunicorn

# Make start script executable
RUN chmod +x /app/start.sh

# Use the startup script
CMD ["/app/start.sh"] 