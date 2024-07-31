from pymongo import MongoClient
from ..config import modb
from typing import Generator

MONGODB_URI = modb.mongodb_uri

client = MongoClient(MONGODB_URI)

def get_db() -> Generator:
    db = client["ELTS"]
    yield db