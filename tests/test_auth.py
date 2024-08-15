from app.models import usermodels
from fastapi.testclient import TestClient
from app.config import settings
from jose import jwt
from uuid import UUID
from .psqlconfig import client, session, test_user, authorized_client, token
import pytest


def test_create_user(client: TestClient):
    response = client.post(
        url="/auth/sign_up",
        json={"email": "testuser@gmail.com", "username": "testuser",
              "password": "Password123!", "name": "Tom der Tester", "age": 99}
    )
    new_user = usermodels.User(**response.json())
    assert new_user.email == "testuser@gmail.com"
    assert isinstance(new_user.id, UUID)
    assert response.status_code == 201

def test_create_user2(client: TestClient):
    response = client.post(
        url="/auth/sign_up",
        json={"email": "testuser@gmail.com", "username": "testuser",
              "password": "Password123!"}
    )
    new_user = usermodels.User(**response.json())
    assert new_user.email == "testuser@gmail.com"
    assert isinstance(new_user.id, UUID)
    assert response.status_code == 201

def test_create_user3(client: TestClient):
    response = client.post(
        url="/auth/sign_up",
        json={"email": "testuser@gmail.com", "username": "testuser",
              "password": "Password123!", "google_account": True}
    )
    new_user = usermodels.User(**response.json())
    assert new_user.email == "testuser@gmail.com"
    assert isinstance(new_user.id, UUID)
    assert response.status_code == 201


def test_wrong_password_creation(client: TestClient):
    response = client.post(
        url="/auth/sign_up",
        json={"email": "testuser@gmail.com", "username": "testuser",
              "password": "1234", "name": "Tom der Tester", "age": 99}
    )
    assert response.status_code == 422


def test_duplicating_user(client: TestClient, test_user):
    response = client.post(
        url="/auth/sign_up",
        json={"email": "testuser@gmail.com", "username": "testuser",
              "password": "Password123!", "name": "Tom der Tester", "age": 99}
    )
    assert response.status_code == 409


def test_login(client: TestClient, test_user):
    response = client.post(
        url="/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]})
    login_response = usermodels.Token(**response.json())
    payload = jwt.decode(login_response.access_token,
                         settings.secret_key, algorithms=[settings.algorithm])
    id = payload.get("user_id")
    assert login_response.token_type == "bearer"
    assert id == test_user["id"]
    assert response.status_code == 200


@pytest.mark.parametrize("email, password, status_code", [
    ("wrongemail@gmail.com", "Password123!", 403),
    ("testuser@gmail.com", "wrongpassword123!", 403),
    (None, "Password123!", 422),
    ("testuser@gmail.com", None, 422)
])
def test_incorrect_login(client: TestClient, test_user, email, password, status_code):
    response = client.post(
        url="/auth/login",
        data={"username": email, "password": password})
    assert response.status_code == status_code


def test_get_user(authorized_client: TestClient):
    response = authorized_client.get(
        "/auth/users/me"
    )
    assert response.status_code == 200


def test_delete_user(authorized_client: TestClient):
    response = authorized_client.delete(
        "auth/delete_user"
    )
    assert response.status_code == 204


def test_update_user(authorized_client: TestClient):
    response = authorized_client.put(
        url="/auth/update_user_infos",
        json={"email": "testuser@gmail.com",
              "username": "tombk556",
              "name": "Tom", 
              "age": 50})
    assert response.status_code == 200