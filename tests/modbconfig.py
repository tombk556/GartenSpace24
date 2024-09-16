import pytest
from pymongo import MongoClient
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from fastapi import FastAPI
from app.config import modb, psql
from app.db import PostgresDB, MongoDB
from app.oauth2 import create_access_token
import json
from bson import ObjectId
from gridfs import GridFS
import os

from app import postgrestables

MONGODB_URI = modb.mongodb_uri


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
def mongo_session():
    client = MongoClient(MONGODB_URI)
    client.drop_database("ELTS_test")
    db = client["ELTS_test"]
    yield db


@pytest.fixture(scope="function")
def mongo_fs_session():
    client = MongoClient(MONGODB_URI)
    client.drop_database("ELTS_FS_test")
    db = client["ELTS_FS_test"]
    fs = GridFS(db)
    yield fs


PSQL_DB_URL = psql.test_database_url_psql
engine = create_engine(PSQL_DB_URL.replace(
    "postgres", "postgresql"), echo=True)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def postgres_session():
    postgrestables.Base.metadata.drop_all(bind=engine)
    postgrestables.Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client(mongo_session, postgres_session, mongo_fs_session):
    def override_get_fs_mongo():
        yield mongo_fs_session

    def override_get_db_mongo():
        yield mongo_session

    def override_get_db_postgres():
        try:
            yield postgres_session
        finally:
            postgres_session.close()

    test_app = create_test_app()
    app.dependency_overrides[MongoDB.get_db] = override_get_db_mongo
    app.dependency_overrides[MongoDB.get_fs] = override_get_fs_mongo
    app.dependency_overrides[PostgresDB.get_db] = override_get_db_postgres
    yield TestClient(test_app)


@pytest.fixture
def test_user(client: TestClient):
    user_data = {
        "email": "mongodbtestuser@gmail.com",
        "username": "mongodbtestuser",
        "password": "Password123!",
        "name": "Tom der Tester",
        "age": 18
    }
    response = client.post("/auth/sign_up", json=user_data)
    assert response.status_code == 201
    return response.json()


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
    entities = load_json_data("data/entities.json")

    for entity in entities:
        response = authorized_client.post(
            "/entities/create_entity", json=entity)
        assert response.status_code == 201

    return entities


@pytest.fixture
def entity(authorized_client: TestClient):
    response = authorized_client.post(
        url="entities/create_entity",
        json={
            "address": {
                "country": "Deutschland",
                "city": "Waldorferstraße 4",
                "plz": "72124",
                "street": "Pliezhausen"
            },
            "meta": {
                "type": "Gütle",
                "size": 245,
                "price": 20000,
                "description": "Dieses schön gelegene Gütle in Pliezhausen ladet dich ein für deinen Geburstag. "
            },
            "properties": [
                "Schuppen",
                "Grillstelle",
                "Parkplätze"
            ]
        }
    )

    assert response.status_code == 201
    assert ObjectId(response.json())
    return response.json()


@pytest.fixture
def entity_image(authorized_client: TestClient, entity):
    response = authorized_client.put(
        url=f"entities/upload/{entity}",
        files={"file": ("test_image.png",
                        open(
                            "/Users/tom/Documents/ELTS/ELTS_backend/tests/data/test_image.png", "rb"),
                        "image/png")}
    )
    entity_id = response.json()["entity_id"]
    image_id = response.json()["file_id"]
    assert ObjectId(entity_id)
    assert ObjectId(image_id)
    assert response.status_code == 200
    assert "file_id" in response.json()
    return entity_id, image_id
