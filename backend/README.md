1. Создаём виртуальное окружение Python в папке venv: python -m venv venv
2. Разрешаем выполнение локальных скриптов в PowerShell(для Windows): Set-ExecutionPolicy RemoteSigned -Scope Process
3. Активируем виртуальное окружение из папки venv: .\venv\Scripts\activate (для Windows), source venv/bin/activate (для Linux/Mac)
4. Устанавливаем все необходимые пакеты: pip install -r requirements.txt
5. Зарегистрироваться на сайте OpenWeather для получения собственного API ключа: http://api.openweathermap.org
![alt text](sources/find_api.png)
![alt text](sources/copy_key.png)
6. Зарегистрироваться на сайте Visual Crossing для получения собственного API ключа: https://www.visualcrossing.com
![alt text](sources/find_api_2.png)
![alt text](sources/copy_key_2.png)
7. Создать файл .env, куда нужно будеть вставить свои API ключи.
![alt text](sources/insert_keys.png)
8. Создание базы данных и пользователя: sudo -u postgres psql(для Linux/Mac) psql -U postgres(для Windows)
CREATE DATABASE weather_db;
CREATE USER weather_user WITH PASSWORD 'weather_password';
GRANT ALL PRIVILEGES ON DATABASE weather_db TO weather_user;
ALTER DATABASE weather_db OWNER TO weather_user;
9. Добавить в файл .env свой пароль для подключения к базе данных.
![alt text](sources/database_connect.png)
10. Запустить приложение: python app.py