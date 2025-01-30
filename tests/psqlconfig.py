from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.db import PostgresDB
from sqlalchemy import create_engine
from app import models
from app.config import psql
from app.main import app
from sqlalchemy.orm import sessionmaker
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.ext.declarative import declarative_base
import pytest
import json
import os
from app.auth.oauth2 import create_access_token

PSQL_DB_URL = psql.test_database_url_psql
engine = create_engine(PSQL_DB_URL.replace("postgres", "postgresql"))
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def load_json_data(filename):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    full_path = os.path.join(dir_path, filename)
    with open(full_path, 'r') as file:
        data = json.load(file)
    return data


def create_test_app() -> FastAPI:
    test_app = FastAPI()
    for route in app.routes:
        test_app.router.routes.append(route)
    return test_app


@pytest.fixture(scope="function")
def session():
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client(session):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    test_app = create_test_app()
    test_app.add_middleware(SessionMiddleware, secret_key="secret_key")
    app.dependency_overrides[PostgresDB.get_db] = override_get_db
    yield TestClient(test_app)


@pytest.fixture
def test_user(client: TestClient):
    user_data = {"email": "testuser@gmail.com", "username": "testuser",
                 "password": "Password123!", "name": "Tom der Tester", "age": 18}
    response = client.post("/auth/sign_up", json=user_data)

    assert response.status_code == 201
    new_user = response.json()
    new_user["email"] = user_data["email"]
    new_user["password"] = user_data["password"]

    return new_user


@pytest.fixture
def token(test_user):
    return create_access_token(data={"user_id": str(test_user["id"])})


@pytest.fixture
def authorized_client(client: TestClient, token):
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    return client


@pytest.fixture
def entities(authorized_client: TestClient):
    entities = load_json_data("./data/entities.json")
    ids = []
    for entity in entities:
        response = authorized_client.post(
            url="/entities/create_entity",
            json=entity
        )

        assert response.status_code == 201
        ids.append(response.json())

    return ids

@pytest.fixture
def entity(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "72124",
                "street": "Pliezhausen"
            },
            "meta": {
                "type": "Gütle",
                "size": 245,
                "price": 20000,
                "offer": "Mieten",
                "description": "Dieses schön gelegene Gütle in Pliezhausen ladet dich ein für deinen Geburstag ein."
            },
            "properties": [
                "Schuppen",
                "Grillstelle",
                "Kamin"
            ]
        },
    )

    assert response.status_code == 201
    return response.json()["id"]

@pytest.fixture
def entity_image(authorized_client: TestClient, entity):
    response = authorized_client.put(
        url = f"/entities/upload/{entity}",
        files={"file": ("bild1.png", 
                        open("/Users/tom/Documents/ELTS/ELTS_backend/tests/data/bild1.png", "rb"),
                        "image/png")}
    )
    
    assert response.status_code == 200
    return entity


@pytest.fixture
def adverts(authorized_client: TestClient):
    adverts = load_json_data("./data/adverts.json")
    ids = []
    for advert in adverts:
        response = authorized_client.post(
            url="/advert/create_advert",
            json=advert
        )

        assert response.status_code == 201
        ids.append(response.json())

    return ids

@pytest.fixture
def advert(authorized_client: TestClient):
    response = authorized_client.post(
        url="/advert/create_advert",
        json={
            "plz": "07112",
            "city": "Stuttgart",
            "country": "Baden-Württemberg",
            "type": "Schrebergarten",
            "offer": "Mieten",
            "attributes": [
                "Schuppen",
                "Kamin",
                "Terrasse"
            ],
            "description": "Ich suche ein Gütle in meiner Heimat Stuttgart"
        }
    )
    assert response.status_code == 201
    return response.json()["id"]