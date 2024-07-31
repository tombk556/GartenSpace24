from fastapi.testclient import TestClient
from .modbconfig import *


def test_create_entity(authorized_client: TestClient):
    response = authorized_client.post(
        url="entities/create_entity",
        json={
            "address": {
                "country": "Muserland",
                "city": "Musterstadt",
                "plz": "12345",
                "street": "Musterstraße"
            },
            "meta": {
                "type": "house",
                "size": "100m²",
                "rooms": 4,
                "price": "100000€",
                "description": "This is a beautiful house"
            },
            "properties": {
                "garden": True,
                "garage": False
            }
        }
    )
    assert response.status_code == 201
    

def test_get_entities(authorized_client: TestClient, entities):
    response = authorized_client.get(url="entities/get_entities")
    assert response.status_code == 200
    assert response.json() == entities
