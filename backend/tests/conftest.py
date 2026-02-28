import importlib
import os
import pytest
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))


@pytest.fixture(autouse=True)
def no_real_db(monkeypatch):
    """
    Гарантируем, что тесты не используют реальную БД.
    """
    monkeypatch.setenv("DB_USER", "x")
    monkeypatch.setenv("DB_PASSWORD", "x")
    monkeypatch.setenv("DB_HOST", "127.0.0.1")
    monkeypatch.setenv("DB_PORT", "9999")  # несуществующий порт
    monkeypatch.setenv("DB_NAME", "x")


@pytest.fixture
def app_client(monkeypatch):
    """
    Flask test client.
    """
    # чтобы app.py подхватил правильные env и т.п.
    import app as app_module

    app_module.app.config["TESTING"] = True
    return app_module.app.test_client()
