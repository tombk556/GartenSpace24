from app.auth import oauth2
from app.db import PostgresDB
from app.auth.schemas import User
from app.entities2.schemas import EntityModel, EntityResponse
from app import models

from fastapi import Query
from uuid import UUID
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
    entity = models.Entity(**entity.to_flat_dict(owner_id=current_user.id))

    db.add(entity)
    db.commit()
    db.refresh(entity)

    return entity.id


@entities2.get("/get_all_entities", status_code=status.HTTP_200_OK, response_model=list[EntityResponse])
def get_all_entities(db: Session = Depends(PostgresDB.get_db)):
    entities = db.query(models.Entity).all()
    return [EntityResponse.from_orm(entity) for entity in entities]


@entities2.get("/get_entity/{id}", status_code=status.HTTP_200_OK)
def get_entity(id: str, db: Session = Depends(PostgresDB.get_db)):
    try:
        UUID(id, version=4)
    except ValueError:
        raise HTTPException(status_code=422, detail=f"The id {id} is not a valid UUID")

    entity, user = (
        db.query(models.Entity, models.User)
        .join(models.User, models.User.id == models.Entity.owner_id)
        .filter(models.Entity.id == UUID(id))
        .first()
    )
    if not entity:
        raise HTTPException(status_code=404, detail=f"The entity with the id {id} can not be found")
    
    return EntityModel.from_orm(entity, user)


@entities2.get("/get_user_entities", status_code=status.HTTP_200_OK, response_model=list[EntityResponse])
def get_user_entities(current_user: User = Depends(oauth2.get_current_user),
                      db: Session = Depends(PostgresDB.get_db)):
    entities = db.query(models.Entity).filter(models.Entity.owner_id == current_user.id).all()
    return [EntityResponse.from_orm(entity) for entity in entities]


@entities2.put("/upload/{id}")
async def upload_image(id: str, file: UploadFile = File(...), current_user: User = Depends(oauth2.get_current_user),
                       db: Session = Depends(PostgresDB.get_db)):
    try:
        UUID(id, version=4)
    except ValueError:
        raise HTTPException(status_code=422, detail=f"The id {id} is not a valid UUID")
    
    entity = db.query(models.Entity).filter(models.Entity.id == id, 
                                            models.Entity.owner_id == current_user.id).first()
    
    if not entity:
        raise HTTPException(status_code=404, detail=f"The entity with the id {id} can not be found")

    
    if file.content_type not in ["image/png", "image/jpeg"]:
        raise HTTPException(status_code=422, detail="File must be PNG or JPEG")
    
    file_content = await file.read()
    
    image = models.Image(filename=file.filename, content=file_content, entity_id=entity.id)

    db.add(image)
    db.commit()
    db.refresh(image)
    
    return "asdf"