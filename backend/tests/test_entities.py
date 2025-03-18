from uuid import UUID
from fastapi.testclient import TestClient
from .psqlconfig import token, entities, entity_image, entity
from .psqlconfig import client, session, test_user, authorized_client


def test_create_entity_201_1(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "01099",
                "street": "Pliezhausen"
            },
            "meta": {
                "size": 245,
                "price": 100000.99,
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

def test_create_entity_201_2(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "01099",
                "street": "Pliezhausen"
            },
            "meta": {
                "size": 245,
                "price": "100000,99",
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
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "7212490",
                "street": "Pliezhausen"
            },
            "meta": {
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
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "7212",
                "street": "Pliezhausen"
            },
            "meta": {
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


def test_create_entity_422_3(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "010991",
                "street": "Pliezhausen"
            },
            "meta": {
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

def test_create_entity_422_4(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "010991",
                "street": "Pliezhausen"
            },
            "meta": {
                "size": 245,
                "price": 20000.2342,
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

def test_create_entity_422_5(authorized_client: TestClient):
    response = authorized_client.post(
        url="/entities/create_entity",
        json={
            "address": {
                "country": "Baden-Württemberg",
                "city": "Waldorferstraße 4",
                "plz": "010991",
                "street": "Pliezhausen"
            },
            "meta": {
                "size": 245,
                "price": 10000_000.01,
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
    assert len(response.json()) == 2


def test_upload_image(authorized_client: TestClient, entity):
    response = authorized_client.put(
        url=f"/entities/upload/{entity}",
        files={"file": ("bild1.png",
                        open(
                            "/Users/tom/Documents/GartenSpace24/app/backend/tests/data/bild1.png", "rb"),
                        "image/png")}
    )

    assert response.status_code == 200


def test_upload_images(authorized_client: TestClient, entity):
    images = ["bild1.png", "bild2.png", "bild3.png",
              "bild4.png", "bild5.png", "bild6.png"]

    for image in images:
        response = authorized_client.put(
            url=f"/entities/upload/{entity}",
            files=[
                ("file", (image,
                          open(
                              f"/Users/tom/Documents/GartenSpace24/app/backend/tests/data/{image}", "rb"),
                          "image/png"))])

        assert response.status_code == 200


def test_get_entity(client: TestClient, entity):
    response = client.get(
        url=f"/entities/get_entity/{entity}"
    )

    assert response.status_code == 200
    assert not response.json()["images"]
    assert UUID(response.json()["id"])


def test_get_entity_with_image(client: TestClient, entity_image):
    response = client.get(
        url=f"/entities/get_entity/{entity_image}"
    )

    assert response.status_code == 200
    assert response.json()["images"]
    assert UUID(response.json()["id"])


def test_download_image(authorized_client: TestClient, entity):
    response = authorized_client.put(
        url=f"/entities/upload/{entity}",
        files={"file": ("bild1.png",
                        open(
                            "/Users/tom/Documents/GartenSpace24/app/backend/tests/data/bild1.png", "rb"),
                        "image/png")}
    )
    assert response.status_code == 200

    image_id = response.json()

    response = authorized_client.get(
        url=f"/entities/download/{entity}/{image_id}"
    )

    assert response.headers.get("content-type") == "image/png"
    assert response.status_code == 200
