# tests/weather_test.py

import pytest
import weather


class DummyResp:
    def __init__(self, status_code=200, json_data=None, raise_for_status_exc=None):
        self.status_code = status_code
        self._json_data = json_data or {}
        self._raise_for_status_exc = raise_for_status_exc

    def json(self):
        return self._json_data

    def raise_for_status(self):
        if self._raise_for_status_exc is not None:
            raise self._raise_for_status_exc


# -----------------------------
# get_lan_lon — equivalence classes + boundary cases
# -----------------------------
def test_get_lan_lon_ok_with_region(mocker):
    mock_get = mocker.patch("weather.requests.get")
    mock_get.return_value = DummyResp(
        status_code=200, json_data=[{"lat": 59.93, "lon": 30.33}]
    )

    lat, lon, code = weather.get_lan_lon("key", "Saint Petersburg", "Leningrad", "RU")
    assert code == 200
    assert lat == 59.93
    assert lon == 30.33

    # boundary: correct URL includes city,region,country
    called_url = mock_get.call_args[0][0]
    assert "Saint Petersburg,Leningrad" in called_url
    assert ",RU" in called_url


def test_get_lan_lon_ok_without_region(mocker):
    mock_get = mocker.patch("weather.requests.get")
    mock_get.return_value = DummyResp(
        status_code=200, json_data=[{"lat": 1.0, "lon": 2.0}]
    )

    lat, lon, code = weather.get_lan_lon("key", "London", None, "GB")
    assert code == 200
    assert lat == 1.0
    assert lon == 2.0

    called_url = mock_get.call_args[0][0]
    assert "q=London,GB" in called_url


def test_get_lan_lon_empty_list_returns_400(mocker):
    mocker.patch("weather.requests.get", return_value=DummyResp(200, []))
    lat, lon, code = weather.get_lan_lon("key", "X", None, "RU")
    assert code == 400
    assert lat is None and lon is None


@pytest.mark.parametrize("status_code", [401, 403, 404, 429, 500])
def test_get_lan_lon_non_200_propagates_status(mocker, status_code):
    mocker.patch("weather.requests.get", return_value=DummyResp(status_code, {"x": 1}))
    lat, lon, code = weather.get_lan_lon("key", "X", None, "RU")
    assert lat is None and lon is None
    assert code == status_code


def test_get_lan_lon_timeout_returns_408(mocker):
    mocker.patch("weather.requests.get", side_effect=weather.Timeout())
    lat, lon, code = weather.get_lan_lon("key", "X", None, "RU")
    assert code == 408


def test_get_lan_lon_request_exception_returns_500(mocker):
    import requests

    mocker.patch(
        "weather.requests.get", side_effect=requests.exceptions.RequestException("boom")
    )
    lat, lon, code = weather.get_lan_lon("key", "X", None, "RU")
    assert code == 500


# -----------------------------
# get_current_weather — parsing + boundary
# -----------------------------
def test_get_current_weather_parsing_ok(mocker):
    fake_api = {
        "weather": [{"description": "clear sky", "icon": "01d"}],
        "main": {"temp": 12.7, "humidity": 50, "pressure": 1012},
        "wind": {"speed": 3.2},
        "visibility": 8000,
        "sys": {"sunrise": 1700000000, "sunset": 1700040000},
    }
    mocker.patch("weather.requests.get", return_value=DummyResp(200, fake_api))

    tf = mocker.patch("weather.TimezoneFinder")
    tf.return_value.timezone_at.return_value = "Europe/Moscow"

    data = weather.get_current_weather(59.93, 30.33, "key")
    assert data.description == "clear sky"
    assert data.icon == "01d"
    assert data.temperature == 12  # int(12.7)
    assert data.wind_speed == 3.2
    assert data.visibility == 8.0  # 8000/1000
    assert data.humidity == 50
    assert data.pressure == 1012
    assert "T" in data.sunrise and "T" in data.sunset


def test_get_current_weather_visibility_zero_boundary(mocker):
    fake_api = {
        "weather": [{"description": "fog", "icon": "50d"}],
        "main": {"temp": 0.0, "humidity": 100, "pressure": 999},
        "wind": {"speed": 0.0},
        "visibility": 0,
        "sys": {"sunrise": 1700000000, "sunset": 1700040000},
    }
    mocker.patch("weather.requests.get", return_value=DummyResp(200, fake_api))
    tf = mocker.patch("weather.TimezoneFinder")
    tf.return_value.timezone_at.return_value = "Europe/Moscow"

    data = weather.get_current_weather(0, 0, "key")
    assert data.visibility == 0.0


# -----------------------------
# get_weather_forecast — equivalence classes + boundary length
# -----------------------------
def test_get_weather_forecast_first_5(mocker):
    fake_forecast = {
        "list": [
            {"dt": 1700000000, "main": {"temp": 1}},
            {"dt": 1700003600, "main": {"temp": 2}},
            {"dt": 1700007200, "main": {"temp": 3}},
            {"dt": 1700010800, "main": {"temp": 4}},
            {"dt": 1700014400, "main": {"temp": 5}},
            {"dt": 1700018000, "main": {"temp": 6}},
        ]
    }
    mocker.patch("weather.requests.get", return_value=DummyResp(200, fake_forecast))
    tf = mocker.patch("weather.TimezoneFinder")
    tf.return_value.timezone_at.return_value = "Europe/Moscow"

    out = weather.get_weather_forecast(1, 2, "key")
    assert len(out) == 5
    assert out[0].temperature == 1
    assert "T" in out[0].time


def test_get_weather_forecast_less_than_5(mocker):
    fake_forecast = {"list": [{"dt": 1700000000, "main": {"temp": 1}}]}
    mocker.patch("weather.requests.get", return_value=DummyResp(200, fake_forecast))
    tf = mocker.patch("weather.TimezoneFinder")
    tf.return_value.timezone_at.return_value = "Europe/Moscow"

    out = weather.get_weather_forecast(1, 2, "key")
    assert len(out) == 1
    assert out[0].temperature == 1


def test_get_weather_forecast_missing_list_returns_empty(mocker):
    fake_forecast = {}
    mocker.patch("weather.requests.get", return_value=DummyResp(200, fake_forecast))
    tf = mocker.patch("weather.TimezoneFinder")
    tf.return_value.timezone_at.return_value = "Europe/Moscow"

    out = weather.get_weather_forecast(1, 2, "key")
    assert out == []


# -----------------------------
# current_weather / forecast_weather — pairwise-ish parametrization
# city x status_code (from geo)
# -----------------------------
@pytest.mark.parametrize(
    "geo_status, expected_ok",
    [
        (200, True),
        (400, False),
        (401, False),
        (408, False),
        (500, False),
    ],
)
def test_current_weather_equivalence_by_geo_status(mocker, geo_status, expected_ok):
    mocker.patch("weather.get_lan_lon", return_value=(10, 20, geo_status))
    mocker.patch(
        "weather.get_current_weather",
        return_value=weather.WeatherData(
            description="ok",
            temperature=1,
            icon="01d",
            wind_speed=1.0,
            visibility=1.0,
            sunrise="2020-01-01T00:00:00+00:00",
            sunset="2020-01-01T01:00:00+00:00",
            humidity=1,
            pressure=1,
        ),
    )

    data, code = weather.current_weather("X", None, "RU")
    assert code == geo_status
    if expected_ok:
        assert data["temperature"] == 1
        assert data["icon"].startswith("https://openweathermap.org/img/wn/")
    else:
        assert data is None


@pytest.mark.parametrize(
    "geo_status, expected_ok",
    [
        (200, True),
        (400, False),
        (404, False),
        (500, False),
    ],
)
def test_forecast_weather_equivalence_by_geo_status(mocker, geo_status, expected_ok):
    mocker.patch("weather.get_lan_lon", return_value=(10, 20, geo_status))
    mocker.patch(
        "weather.get_weather_forecast",
        return_value=[
            weather.WeatherForecastData(
                time="2020-01-01T00:00:00+00:00", temperature=1
            ),
            weather.WeatherForecastData(
                time="2020-01-01T01:00:00+00:00", temperature=2
            ),
        ],
    )

    data, code = weather.forecast_weather("X", None, "RU")
    assert code == geo_status
    if expected_ok:
        assert isinstance(data, list)
        assert data[0]["temperature"] == 1
        assert "date" in data[0]
    else:
        assert data is None


# -----------------------------
# get_past_weather_data — equivalence classes + boundary on wind conversion
# -----------------------------
def test_get_past_weather_data_ok_parsing_and_wind_convert(mocker):
    # windspeed in km/h -> divide by 3.6 to m/s, round 1
    fake_days = [
        {
            "datetime": "2020-01-01",
            "temp": 5,
            "windspeed": 36.0,  # 10.0 m/s
            "visibility": 12,
            "pressure": 1000,
            "humidity": 80,
        }
    ]
    resp = DummyResp(200, {"days": fake_days})
    mock_get = mocker.patch("weather.requests.get", return_value=resp)

    out = weather.get_past_weather_data(1, 2, 1, "key")
    assert isinstance(out, list)
    assert out[0]["date"] == "2020-01-01"
    assert out[0]["temperature"] == 5
    assert out[0]["wind_speed"] == 10.0  # 36/3.6
    assert out[0]["humidity"] == 80

    # boundary: ensures timeout passed
    assert mock_get.call_args[1]["timeout"] == 10


def test_get_past_weather_data_missing_fields_defaults(mocker):
    fake_days = [{"datetime": "2020-01-01"}]  # no temp/windspeed/...
    resp = DummyResp(200, {"days": fake_days})
    mocker.patch("weather.requests.get", return_value=resp)

    out = weather.get_past_weather_data(1, 2, 1, "key")
    assert out[0]["temperature"] is None
    assert out[0]["wind_speed"] == 0.0  # round(0/3.6,1)
    assert out[0]["visibility"] is None


def test_get_past_weather_data_request_exception_returns_none(mocker):
    import requests

    mocker.patch(
        "weather.requests.get", side_effect=requests.exceptions.RequestException("boom")
    )
    out = weather.get_past_weather_data(1, 2, 3, "key")
    assert out is None


def test_get_past_weather_data_raise_for_status_returns_none(mocker):
    import requests

    resp = DummyResp(500, {}, raise_for_status_exc=requests.exceptions.HTTPError("bad"))
    mocker.patch("weather.requests.get", return_value=resp)
    out = weather.get_past_weather_data(1, 2, 3, "key")
    assert out is None


# -----------------------------
# get_spb_weather_from_db — database available/unavailable equivalence classes
# No real DB: patch weather.database.engine + Session
# -----------------------------
def test_get_spb_weather_from_db_engine_none_fallbacks_to_api(mocker):
    # engine is imported inside function: from database import engine, Session
    mocker.patch("database.engine", None)
    mocked_api = mocker.patch(
        "weather.get_past_weather_data",
        return_value=[{"date": "x", "temperature": 1}],
    )

    out = weather.get_spb_weather_from_db(3)
    assert out == [{"date": "x", "temperature": 1}]
    mocked_api.assert_called_once()


def test_get_spb_weather_from_db_no_records_fallbacks_to_api(mocker):
    mocker.patch("database.engine", object())  # any non-None
    mocked_api = mocker.patch(
        "weather.get_past_weather_data",
        return_value=[{"date": "x", "temperature": 2}],
    )

    # mock Session() and chained query().filter()...all()
    session = mocker.Mock()
    session.query.return_value.filter.return_value.filter.return_value.filter.return_value.order_by.return_value.all.return_value = []
    SessionMock = mocker.patch("database.Session", return_value=session)

    out = weather.get_spb_weather_from_db(3)
    assert out == [{"date": "x", "temperature": 2}]
    session.close.assert_called_once()
    mocked_api.assert_called_once()
    SessionMock.assert_called_once()


def test_get_spb_weather_from_db_records_return_mapped_list(mocker):
    mocker.patch("database.engine", object())

    record1 = mocker.Mock()
    record1.date.isoformat.return_value = "2020-01-01"
    record1.temperature = 1
    record1.wind_speed = 2
    record1.visibility = 3
    record1.pressure = 4
    record1.humidity = 5

    record2 = mocker.Mock()
    record2.date.isoformat.return_value = "2020-01-02"
    record2.temperature = 6
    record2.wind_speed = 7
    record2.visibility = 8
    record2.pressure = 9
    record2.humidity = 10

    session = mocker.Mock()
    session.query.return_value.filter.return_value.filter.return_value.filter.return_value.order_by.return_value.all.return_value = [
        record1,
        record2,
    ]
    mocker.patch("database.Session", return_value=session)

    out = weather.get_spb_weather_from_db(2)
    assert out[0]["date"] == "2020-01-01"
    assert out[0]["temperature"] == 1
    assert out[1]["humidity"] == 10
    session.close.assert_called_once()


def test_get_spb_weather_from_db_exception_fallbacks_to_api(mocker):
    mocker.patch("database.engine", object())
    mocked_api = mocker.patch(
        "weather.get_past_weather_data",
        return_value=[{"date": "x", "temperature": 3}],
    )

    session = mocker.Mock()
    session.query.side_effect = Exception("db boom")
    mocker.patch("database.Session", return_value=session)

    out = weather.get_spb_weather_from_db(3)
    assert out == [{"date": "x", "temperature": 3}]
    session.close.assert_called_once()
    mocked_api.assert_called_once()


# -----------------------------
# past_weather — equivalence classes
# -----------------------------
def test_past_weather_ok_when_geo_ok(mocker):
    mocker.patch("weather.get_lan_lon", return_value=(1, 2, 200))
    mocker.patch("weather.get_past_weather_data", return_value=[{"date": "x"}])

    out, code = weather.past_weather("London", None, "GB", 3)
    assert code == 200
    assert out == [{"date": "x"}]


@pytest.mark.parametrize("geo_status", [400, 401, 404, 408, 500])
def test_past_weather_fail_when_geo_not_ok(mocker, geo_status):
    mocker.patch("weather.get_lan_lon", return_value=(None, None, geo_status))
    mocked = mocker.patch("weather.get_past_weather_data")

    out, code = weather.past_weather("X", None, "RU", 3)
    assert code == geo_status
    assert out is None
    mocked.assert_not_called()
