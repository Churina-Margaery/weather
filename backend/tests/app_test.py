# tests/app_test.py
# ~20 tests with test-design techniques:
# - Equivalence classes (valid/invalid params, SPB vs non-SPB)
# - Boundary/edge cases (missing params, empty string, whitespace, unicode, case-insensitive)
# - Pairwise-ish via parametrization (city variant x endpoint x db_has_data)
#
# Requirements:
# - pytest
# - pytest-mock
# - conftest.py provides app_client fixture (as you already have)

import pytest


# -----------------------------
# Helpers / Constants
# -----------------------------
SPB_ALIASES = [
    "спб",
    "Санкт-Петербург",
    "санкт-петербург",
    "saint petersburg",
    "SAINT PETERSBURG",
    "saint-petersburg",
]

NON_SPB_ALIASES = [
    "spb",  # IMPORTANT: not in app.py list -> should go to API branch
    "Moscow",
    "London",
    "New York",
    "Tokyo",
]


# -----------------------------
# Root "/" endpoint tests
# Equivalence classes + boundaries
# -----------------------------
def test_root_current_weather_ok(app_client, mocker):
    mocker.patch(
        "app.current_weather",
        return_value=({"temperature": 10, "description": "ok"}, 200),
    )
    resp = app_client.get("/?city_name=London&country_name=GB")
    assert resp.status_code == 200
    assert resp.get_json()["temperature"] == 10


@pytest.mark.parametrize("status_code", [400, 401, 404, 408, 429, 500])
def test_root_current_weather_fail_statuses(app_client, mocker, status_code):
    # Equivalence class: any non-200 should return {"detail":...} and same status code
    mocker.patch("app.current_weather", return_value=(None, status_code))
    resp = app_client.get("/?city_name=London&country_name=GB")
    assert resp.status_code == status_code
    assert resp.get_json()["detail"] == "Failed to get weather data"


def test_root_passes_query_params_to_service(app_client, mocker):
    # Checks correct wiring and param mapping (incl state_name default)
    spy = mocker.patch("app.current_weather", return_value=({"temperature": 1}, 200))
    resp = app_client.get("/?city_name=Austin&state_name=TX&country_name=US")
    assert resp.status_code == 200
    spy.assert_called_once_with("Austin", "TX", "US")


@pytest.mark.parametrize(
    "query",
    [
        "/?country_name=GB",  # missing city_name
        "/?city_name=London",  # missing country_name
        "/?city_name=&country_name=GB",  # empty city_name (boundary)
        "/?city_name=London&country_name=",  # empty country_name (boundary)
    ],
)
def test_root_missing_or_empty_params_propagates_failure(app_client, mocker, query):
    # Your route doesn't validate inputs itself; it delegates to current_weather.
    # We'll enforce that when service says 400 -> route returns 400 with detail.
    mocker.patch("app.current_weather", return_value=(None, 400))
    resp = app_client.get(query)
    assert resp.status_code == 400
    assert resp.get_json()["detail"] == "Failed to get weather data"


# -----------------------------
# "/forecast/" endpoint tests
# Equivalence classes + boundaries
# -----------------------------
def test_forecast_ok(app_client, mocker):
    mocker.patch(
        "app.forecast_weather", return_value=([{"date": "x", "temperature": 1}], 200)
    )
    resp = app_client.get("/forecast/?city_name=London&country_name=GB")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)
    assert resp.get_json()[0]["temperature"] == 1


@pytest.mark.parametrize("status_code", [400, 404, 500])
def test_forecast_fail_statuses(app_client, mocker, status_code):
    mocker.patch("app.forecast_weather", return_value=(None, status_code))
    resp = app_client.get("/forecast/?city_name=London&country_name=GB")
    assert resp.status_code == status_code
    assert resp.get_json()["detail"] == "Failed to get weather data"


def test_forecast_passes_query_params_to_service(app_client, mocker):
    spy = mocker.patch("app.forecast_weather", return_value=([], 200))
    resp = app_client.get("/forecast/?city_name=Austin&state_name=TX&country_name=US")
    assert resp.status_code == 200
    spy.assert_called_once_with("Austin", "TX", "US")


# -----------------------------
# "/3days/" endpoint tests
# SPB branch vs non-SPB branch
# Pairwise-ish parametrization + boundaries
# -----------------------------
@pytest.mark.parametrize("city_name", SPB_ALIASES)
def test_3days_spb_db_path_returns_db_data(app_client, mocker, city_name):
    # Equivalence class: any recognized SPB alias -> DB path attempted
    mocked_db = mocker.patch(
        "app.get_spb_weather_from_db",
        autospec=True,
        return_value=[{"date": "2020-01-01", "temperature": 1}],
    )
    mocked_api = mocker.patch(
        "app.past_weather"
    )  # should not be called when DB returns data

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
def test_3days_spb_fallback_api_failure_propagates(app_client, mocker, status_code):
    # Boundary: DB empty -> fallback -> failure
    mocker.patch("app.get_spb_weather_from_db", return_value=None)
    mocker.patch("app.past_weather", return_value=(None, status_code))

    resp = app_client.get("/3days/?city_name=спб&country_name=RU")
    assert resp.status_code == status_code
    assert resp.get_json()["detail"] == "Failed to get weather data"


@pytest.mark.parametrize("city_name", NON_SPB_ALIASES)
def test_3days_non_spb_goes_directly_to_api(app_client, mocker, city_name):
    # Equivalence class: non-SPB should never call DB
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
    # Boundary: case-insensitivity
    mocker.patch(
        "app.get_spb_weather_from_db", return_value=[{"date": "x", "temperature": 4}]
    )
    resp = app_client.get("/3days/?city_name=SAINT%20PETERSBURG&country_name=RU")
    assert resp.status_code == 200
    assert resp.get_json()[0]["temperature"] == 4


def test_3days_city_name_with_whitespace_not_recognized_as_spb(app_client, mocker):
    # Boundary: leading/trailing whitespace is NOT stripped in app.py
    # Therefore " спб " should go to non-SPB branch (API).
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
    "query",
    [
        "/3days/?country_name=RU",
        "/10days/?country_name=RU",
    ],
)
def test_missing_city_name_raises_attribute_error_in_testing_mode(app_client, query):
    with pytest.raises(AttributeError):
        app_client.get(query)


# -----------------------------
# "/10days/" endpoint tests
# Similar to /3days/ but boundary on days=10
# Pairwise-ish: alias x db_has_data
# -----------------------------
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
def test_10days_api_failure_propagates(app_client, mocker, status_code):
    mocker.patch("app.past_weather", return_value=(None, status_code))
    resp = app_client.get("/10days/?city_name=London&country_name=GB")
    assert resp.status_code == status_code
    assert resp.get_json()["detail"] == "Failed to get weather data"


# -----------------------------
# Pairwise-style parametrized checks (small set)
# city variant x endpoint (/3days/ or /10days/) x db_has_data for SPB
# -----------------------------
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
        ("London", False),  # non-SPB always API
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
        # SPB branch: DB first
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
        # non-SPB -> API
        resp = app_client.get(f"{endpoint}?city_name={city_name}&country_name=GB")
        assert resp.status_code == 200
        assert resp.get_json()[0]["temperature"] == 9
        mocked_db.assert_not_called()
        mocked_api.assert_called_once()
