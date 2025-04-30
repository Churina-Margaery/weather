# Weather API Documentation

## Base URL
`https://api.weather.com/`

---

## Endpoints

### 1. Current Weather
**URL**: `/`  
**Method**: `GET`  
**Query Parameters**:
- `city_name` (required) - название города (например: `London`)
- `state_name` (optional) - название штата/региона (например: `England`)
- `country_name` (required) - код страны (например: `UK`)

**Example:**

```http
GET /?city_name=London&state_name=England&country_name=UK
```

**Response**:  

status code 200 
```json
{
  "temperature": 20,
  "wind_speed": 5.2,
  "visibility": 10,
  "pressure": 1013,
  "humidity": 65,
  "sunrise": "2023-10-25T06:30:00Z",
  "sunset": "2023-10-25T18:45:00Z",
  "description": "clear sky",
  "icon": "https://openweathermap.org/img/wn/01d@2x.png"
}
```


### 2. Past data for 3 days
**URL**: `/3days/`  
**Method**: `GET`  
**Query Parameters**:
- `city_name` (required) - название города (например: `London`)
- `state_name` (optional) - название штата/региона (например: `England`)
- `country_name` (required) - код страны (например: `UK`)

**Example:**

```http
GET /3days/?city_name=London&state_name=England&country_name=UK
```

**Response**:  

status code 200 
```json
[
  {
    "date": "2023-10-25",
    "temperature": 22,
    "wind_speed": 4.8,
    "visibility": 9,
    "pressure": 1012,
    "humidity": 60
  },
  {
    "date": "2023-10-26",
    "temperature": 19,
    "wind_speed": 6.1,
    "visibility": 8,
    "pressure": 1015,
    "humidity": 70
  },
  {
    "date": "2023-10-27",
    "temperature": 21,
    "wind_speed": 5.5,
    "visibility": 10,
    "pressure": 1010,
    "humidity": 55
  }
]
```


### 3. Past data for 10 days
**URL**: `/10days`, все тоже самое, что для `/3days`

### 4. General Forecast
**URL**: `/forecast/`  
**Method**: GET  
**Parameters**:
- `city_name` (required) - название города (например: `London`)
- `state_name` (optional) - название штата/региона (например: `England`)
- `country_name` (required) - код страны (например: `UK`)

**Example:**

status code 200
```http
GET /forecast/?city_name=London&state_name=England&country_name=UK
```

```json
[
  {
    "date": "2023-10-25T12:00:00Z",
    "temperature": 24
  },
  {
    "date": "2023-10-25T15:00:00Z",
    "temperature": 22
  },
  ... // 3 объекта
]
```

### Wrong location example

status code 400
```http
GET /forecast/?city_name=Lrn&state_name=England&country_name=UK
```
```json
{
"detail": "Город \"Lrn\" не найдет."
}
```
