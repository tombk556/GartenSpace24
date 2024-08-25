from pymongo import MongoClient
from ..config import modb
from typing import Generator
from gridfs import GridFS

MONGODB_URI = modb.mongodb_uri

client = MongoClient(MONGODB_URI)

def get_db() -> Generator:
    db = client["ELTS"]
    yield db
    
def get_fs() -> Generator:
    db = client["ELTS_FS"]
    fs = GridFS(db)
    yield fs