from app.auth import schemas
from fastapi.testclient import TestClient
from app.config import settings
from jose import jwt
from uuid import UUID
from .psqlconfig import client, session, test_user, authorized_client, token, entities, entity_image, entity
import pytest


def test_create_entity_201(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
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
    return response.json()


def test_create_entity_422_1(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Deutschland",
                "city": "Waldorferstraße 4",
                "plz": "7212490",
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

    assert response.status_code == 422


def test_create_entity_422_2(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Deutschland",
                "city": "Waldorferstraße 4",
                "plz": "7212",
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
                "Kamin",
                "Bierpong"
            ]
        }
    )

    assert response.status_code == 422


def test_get_entities(client: TestClient, entities):
    response = client.get(
        url="/entities/get_all_entities"
    )

    assert response.status_code == 200
    assert len(response.json()) == 3


def test_upload_image(authorized_client: TestClient, entity):
    response = authorized_client.put(
        url = f"/entities/upload/{entity}",
        files={"file": ("bild1.png", 
                        open("/Users/tom/Documents/ELTS/ELTS_backend/tests/data/bild1.png", "rb"),
                        "image/png")}
    )
    
    assert response.status_code == 200

def test_get_entity(client: TestClient, entity_image):
    response = client.get(
        url=f"/entities/get_entity/{entity_image}"
    )

    assert response.status_code == 200