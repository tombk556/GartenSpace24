from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.db.postgres import get_db
from sqlalchemy import create_engine
from app.db import postgrestables
from app.config import psql
from app.main import app
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import pytest
from app.oauth2 import create_access_token

PSQL_DB_URL = psql.test_database_url_psql
engine = create_engine(PSQL_DB_URL.replace("postgres", "postgresql"))
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_test_app() -> FastAPI:
    test_app = FastAPI()
    for route in app.routes:
        test_app.router.routes.append(route)
    return test_app

@pytest.fixture(scope="function")
def session():
    postgrestables.Base.metadata.drop_all(bind=engine)
    postgrestables.Base.metadata.create_all(bind=engine)
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
    app.dependency_overrides[get_db] = override_get_db
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