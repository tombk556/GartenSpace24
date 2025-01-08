from app.auth import schemas
from fastapi.testclient import TestClient
from app.config import settings
from jose import jwt
from uuid import UUID
from .psqlconfig import client, session, test_user, authorized_client, token
from .psqlconfig import adverts, advert
import pytest


def test_create_advert_201(authorized_client: TestClient):
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
    assert UUID(response.json()["id"])
    
def test_create_advert_422_1(authorized_client: TestClient):
    response = authorized_client.post(
        url="/advert/create_advert",
        json={
            "plz": "07112",
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
    assert response.status_code == 422

def test_create_advert_422_2(authorized_client: TestClient):
    response = authorized_client.post(
        url="/advert/create_advert",
        json={
            "plz": "07112",
            "country": "Baden-Württemberg",
            "type": "Schrebergarten",
            "offer": "Mieten",
            "attributes": [
                "Schuppen",
                "Kamin",
                "Terrasse",
                "Bier Pong"
            ],
            "description": "Ich suche ein Gütle in meiner Heimat Stuttgart"
        }
    )
    assert response.status_code == 422
    
def test_get_adverts(client: TestClient, adverts):
    response = client.get(
        url="/advert/get_all_adverts"
    )
    
    assert response.status_code == 200
    assert len(response.json()) == 3
    
def test_get_advert(client: TestClient, advert):
    response = client.get(
        url=f"/advert/get_advert/{advert}"
    )
    assert response.status_code == 200
    
def test_delete_advert(authorized_client: TestClient, advert):
    response = authorized_client.delete(
        url=f"/advert/delete/{advert}"
    )

    assert response.status_code == 204