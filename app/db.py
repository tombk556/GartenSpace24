from pymongo import MongoClient
from .config import modb, psql
from typing import Generator
from gridfs import GridFS
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

MONGODB_URI = modb.mongodb_uri
client = MongoClient(MONGODB_URI)

class MongoDB:
    def get_db() -> Generator:
        db = client["ELTS"]
        yield db
        
    def get_fs() -> Generator:
        db = client["ELTS_FS"]
        fs = GridFS(db)
        yield fs
        

PSQL_DB_URL = psql.database_url_psql
engine = create_engine(PSQL_DB_URL.replace("postgres", "postgresql"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PostgresDB:
    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
        