import pytest


SPB_ALIASES = [
    "спб",
    "Санкт-Петербург",
    "санкт-петербург",
    "saint petersburg",
    "SAINT PETERSBURG",
    "saint-petersburg",
]

NON_SPB_ALIASES = [
    "spb",
    "Moscow",
    "London",
    "New York",
    "Tokyo",
]


def test_root_current_weather_ok(app_client, mocker):
    mocker.patch(
        "app.current_weather",
        return_value=({"temperature": 10, "description": "ok"}, 200),
    )
    resp = app_client.get("/?city_name=London&country_name=GB")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["temperature"] == 10
    assert data["description"] == "ok"


@pytest.mark.parametrize("status_code", [400, 401, 404, 408, 429, 500])
def test_root_current_weather_fail_statuses_return_empty_payload(
    app_client, mocker, status_code
):
    mocker.patch("app.current_weather", return_value=(None, status_code))
    resp = app_client.get("/?city_name=London&country_name=GB")

    assert resp.status_code == 200
    data = resp.get_json()
    assert data["temperature"] == 0
    assert data["wind_speed"] == 0
    assert data["visibility"] == 0
    assert data["pressure"] == 0
    assert data["humidity"] == 0
    assert data["description"] == "No data available"
    assert data["icon"] == ""
    assert "sunrise" in data
    assert "sunset" in data


def test_root_current_weather_exception_returns_empty_payload(app_client, mocker):
    mocker.patch("app.current_weather", side_effect=Exception("boom"))
    resp = app_client.get("/?city_name=London&country_name=GB")

    assert resp.status_code == 200
    data = resp.get_json()
    assert data["temperature"] == 0
    assert data["description"] == "No data available"
    assert data["icon"] == ""


def test_root_passes_query_params_to_service(app_client, mocker):
    spy = mocker.patch("app.current_weather", return_value=({"temperature": 1}, 200))
    resp = app_client.get("/?city_name=Austin&state_name=TX&country_name=US")
    assert resp.status_code == 200
    spy.assert_called_once_with("Austin", "TX", "US")


@pytest.mark.parametrize(
    "query",
    [
        "/?country_name=GB",
        "/?city_name=London",
        "/?city_name=&country_name=GB",
        "/?city_name=London&country_name=",
    ],
)
def test_root_missing_or_empty_params_return_empty_payload(app_client, mocker, query):
    mocker.patch("app.current_weather", return_value=(None, 400))
    resp = app_client.get(query)

    assert resp.status_code == 200
    data = resp.get_json()
    assert data["temperature"] == 0
    assert data["description"] == "No data available"


def test_forecast_ok(app_client, mocker):
    mocker.patch(
        "app.forecast_weather",
        return_value=([{"date": "x", "temperature": 1}], 200),
    )
    resp = app_client.get("/forecast/?city_name=London&country_name=GB")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)
    assert resp.get_json()[0]["temperature"] == 1


@pytest.mark.parametrize("status_code", [400, 404, 500])
def test_forecast_fail_statuses_return_empty_forecast(app_client, mocker, status_code):
    mocker.patch("app.forecast_weather", return_value=(None, status_code))
    resp = app_client.get("/forecast/?city_name=London&country_name=GB")

    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == 5
    assert all(item["temperature"] == 0 for item in data)
    assert all("date" in item for item in data)


def test_forecast_exception_returns_empty_forecast(app_client, mocker):
    mocker.patch("app.forecast_weather", side_effect=Exception("boom"))
    resp = app_client.get("/forecast/?city_name=London&country_name=GB")

    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == 5
    assert all(item["temperature"] == 0 for item in data)


def test_forecast_passes_query_params_to_service(app_client, mocker):
    spy = mocker.patch("app.forecast_weather", return_value=([], 200))
    resp = app_client.get("/forecast/?city_name=Austin&state_name=TX&country_name=US")
    assert resp.status_code == 200
    spy.assert_called_once_with("Austin", "TX", "US")


@pytest.mark.parametrize("city_name", SPB_ALIASES)
def test_3days_spb_db_path_returns_db_data(app_client, mocker, city_name):
    mocked_db = mocker.patch(
        "app.get_spb_weather_from_db",
        autospec=True,
        return_value=[{"date": "2020-01-01", "temperature": 1}],
    )
    mocked_api = mocker.patch("app.past_weather")

    resp = app_client.get(f"/3days/?city_name={city_name}&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 1
    mocked_db.assert_called_once_with(3)
    mocked_api.assert_not_called()


@pytest.mark.parametrize("city_name", SPB_ALIASES)
def test_3days_spb_fallback_to_api_when_db_none(app_client, mocker, city_name):
    mocker.patch("app.get_spb_weather_from_db", return_value=None)
    mocked_api = mocker.patch(
        "app.past_weather",
        return_value=([{"date": "2020-01-01", "temperature": 2}], 200),
    )
    resp = app_client.get(f"/3days/?city_name={city_name}&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 2
    mocked_api.assert_called_once_with(city_name, None, "RU", 3)


@pytest.mark.parametrize("status_code", [400, 500])
def test_3days_spb_fallback_api_failure_returns_empty_data(
    app_client, mocker, status_code
):
    mocker.patch("app.get_spb_weather_from_db", return_value=None)
    mocker.patch("app.past_weather", return_value=(None, status_code))

    resp = app_client.get("/3days/?city_name=спб&country_name=RU")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == 3
    assert all(item["temperature"] == 0 for item in data)
    assert all(item["wind_speed"] == 0 for item in data)
    assert all(item["visibility"] == 0 for item in data)
    assert all(item["pressure"] == 0 for item in data)
    assert all(item["humidity"] == 0 for item in data)
    assert all("date" in item for item in data)


@pytest.mark.parametrize("city_name", NON_SPB_ALIASES)
def test_3days_non_spb_goes_directly_to_api(app_client, mocker, city_name):
    mocked_db = mocker.patch("app.get_spb_weather_from_db")
    mocked_api = mocker.patch(
        "app.past_weather",
        return_value=([{"date": "2020-01-01", "temperature": 3}], 200),
    )

    resp = app_client.get(f"/3days/?city_name={city_name}&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 3
    mocked_db.assert_not_called()
    mocked_api.assert_called_once_with(city_name, None, "RU", 3)


def test_3days_city_name_case_insensitive_spb(app_client, mocker):
    mocker.patch(
        "app.get_spb_weather_from_db", return_value=[{"date": "x", "temperature": 4}]
    )
    resp = app_client.get("/3days/?city_name=SAINT%20PETERSBURG&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 4


def test_3days_city_name_with_whitespace_not_recognized_as_spb(app_client, mocker):
    mocked_db = mocker.patch("app.get_spb_weather_from_db")
    mocked_api = mocker.patch(
        "app.past_weather",
        return_value=([{"date": "x", "temperature": 5}], 200),
    )

    resp = app_client.get("/3days/?city_name=%20спб%20&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 5
    mocked_db.assert_not_called()
    mocked_api.assert_called_once()


@pytest.mark.parametrize(
    "query,days",
    [
        ("/3days/?country_name=RU", 3),
        ("/10days/?country_name=RU", 10),
    ],
)
def test_missing_city_name_returns_empty_data_not_exception(
    app_client, mocker, query, days
):
    mocker.patch("app.past_weather", return_value=(None, 400))
    resp = app_client.get(query)

    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == days
    assert all(item["temperature"] == 0 for item in data)


@pytest.mark.parametrize("city_name", SPB_ALIASES)
def test_10days_spb_db_path_returns_db_data(app_client, mocker, city_name):
    mocked_db = mocker.patch(
        "app.get_spb_weather_from_db",
        autospec=True,
        return_value=[{"date": "2020-01-01", "temperature": 6}],
    )
    mocked_api = mocker.patch("app.past_weather")

    resp = app_client.get(f"/10days/?city_name={city_name}&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 6
    mocked_db.assert_called_once_with(10)
    mocked_api.assert_not_called()


@pytest.mark.parametrize("city_name", SPB_ALIASES)
def test_10days_spb_fallback_to_api_when_db_none(app_client, mocker, city_name):
    mocker.patch("app.get_spb_weather_from_db", return_value=None)
    mocked_api = mocker.patch(
        "app.past_weather",
        return_value=([{"date": "2020-01-01", "temperature": 7}], 200),
    )
    resp = app_client.get(f"/10days/?city_name={city_name}&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 7
    mocked_api.assert_called_once_with(city_name, None, "RU", 10)


@pytest.mark.parametrize("city_name", NON_SPB_ALIASES)
def test_10days_non_spb_goes_directly_to_api(app_client, mocker, city_name):
    mocked_db = mocker.patch("app.get_spb_weather_from_db")
    mocked_api = mocker.patch(
        "app.past_weather",
        return_value=([{"date": "2020-01-01", "temperature": 8}], 200),
    )

    resp = app_client.get(f"/10days/?city_name={city_name}&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 8
    mocked_db.assert_not_called()
    mocked_api.assert_called_once_with(city_name, None, "RU", 10)


@pytest.mark.parametrize("status_code", [400, 500])
def test_10days_api_failure_returns_empty_data(app_client, mocker, status_code):
    mocker.patch("app.past_weather", return_value=(None, status_code))
    resp = app_client.get("/10days/?city_name=London&country_name=GB")

    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == 10
    assert all(item["temperature"] == 0 for item in data)


@pytest.mark.parametrize(
    "endpoint,days",
    [
        ("/3days/", 3),
        ("/10days/", 10),
    ],
)
@pytest.mark.parametrize(
    "city_name,db_has_data",
    [
        ("спб", True),
        ("спб", False),
        ("London", False),
    ],
)
def test_pairwise_city_endpoint_db_behavior(
    app_client, mocker, endpoint, days, city_name, db_has_data
):
    mocked_db = mocker.patch(
        "app.get_spb_weather_from_db", autospec=True, return_value=None
    )
    mocked_api = mocker.patch(
        "app.past_weather", return_value=([{"date": "x", "temperature": 9}], 200)
    )

    if city_name.lower() in [
        "спб",
        "санкт-петербург",
        "saint petersburg",
        "saint-petersburg",
    ]:
        mocked_db.return_value = (
            [{"date": "x", "temperature": 11}] if db_has_data else None
        )
        resp = app_client.get(f"{endpoint}?city_name={city_name}&country_name=RU")
        assert resp.status_code == 200
        if db_has_data:
            assert resp.get_json()[0]["temperature"] == 11
            mocked_api.assert_not_called()
        else:
            assert resp.get_json()[0]["temperature"] == 9
            mocked_api.assert_called_once()
    else:
        resp = app_client.get(f"{endpoint}?city_name={city_name}&country_name=GB")
        assert resp.status_code == 200
        assert resp.get_json()[0]["temperature"] == 9
        mocked_db.assert_not_called()
        mocked_api.assert_called_once()
