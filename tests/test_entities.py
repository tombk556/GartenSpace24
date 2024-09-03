from fastapi.testclient import TestClient
from bson import ObjectId
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
    assert ObjectId(response.json())
    

def test_get_all_entities(authorized_client: TestClient, entities):
    response = authorized_client.get(url="entities/get_all_entities")
    assert response.status_code == 200
    assert len(response.json()) == len(entities)
    
def test_upload_image(authorized_client: TestClient, entity):
    response = authorized_client.put(
        url=f"entities/upload/{entity}",
        files={"file": ("test_image.png", 
                        open("/Users/tom/Documents/ELTS/ELTS_backend/tests/data/test_image.png", "rb"), 
                        "image/png")}
    )
    entity_id = response.json()["entity_id"]
    image_id = response.json()["file_id"]
    assert ObjectId(entity_id)
    assert ObjectId(image_id)
    assert response.status_code == 200
    assert "file_id" in response.json()

def test_download_image(authorized_client: TestClient, entity_image):
    entity, image = entity_image
    response = authorized_client.get(
        url=f"entities/download/{entity}/{image}"
    )
    assert response.status_code == 200
    
    