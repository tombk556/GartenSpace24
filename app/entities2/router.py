from app.auth import oauth2
from app.db import PostgresDB
from app.auth.schemas import User
from app.entities2.schemas import EntityModel
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
    entity.owner_id=current_user.id
    new_entity = Entity(**entity.model_dump())
    db.add(new_entity)
    db.commit()
    db.refresh(new_entity)
    
    return new_entity