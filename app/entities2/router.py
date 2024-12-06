from app.auth import oauth2
from app.db import PostgresDB
from app.auth.schemas import User
from app.entities2.schemas import EntityModel, EntityResponse
from app.models import Entity

from fastapi import Query
from bson import ObjectId
from gridfs import GridFS
from sqlalchemy.orm import Session
from pymongo.collection import Collection
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException

entities2 = APIRouter(
    prefix="/entities2",
    tags=["Entities"])


@entities2.post("/create_entity", status_code=status.HTTP_201_CREATED)
def create_entity(entity: EntityModel, current_user: User = Depends(oauth2.get_current_user),
                  db: Session = Depends(PostgresDB.get_db)):
    entity = Entity(**entity.to_flat_dict(owner_id=current_user.id))

    db.add(entity)
    db.commit()
    db.refresh(entity)

    return entity.id


@entities2.get("/get_all_entities", status_code=status.HTTP_200_OK, response_model=list[EntityResponse])
def get_all_entities(db: Session = Depends(PostgresDB.get_db)):
    entities = db.query(Entity).all()
    return [EntityResponse.from_orm(entity) for entity in entities]
