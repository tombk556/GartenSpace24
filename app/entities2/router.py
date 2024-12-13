from app.auth import oauth2
from app.db import PostgresDB
from app.auth.schemas import User
from app.entities2.schemas import EntityModel, EntityResponse
from app import models

from fastapi import Query
from uuid import UUID
from gridfs import GridFS
from io import BytesIO
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
def get_entity(id: UUID, db: Session = Depends(PostgresDB.get_db)):
    result = (
        db.query(models.Entity, models.User, models.Image)
        .join(models.User, models.User.id == models.Entity.owner_id)
        .join(models.Image, models.Image.entity_id == id)
        .filter(models.Entity.id == id)
        .all()
    )
    
    if not result:
        raise HTTPException(
            status_code=404, detail=f"The entity with the id {id} cannot be found"
        )
    
    entity = result[0][0]
    user = result[0][1]
    images = [row[2] for row in result if row[2] is not None]  # Collect all Image objects

    return EntityModel.from_orm(entity, user, images)
    



@entities2.get("/get_user_entities", status_code=status.HTTP_200_OK, response_model=list[EntityResponse])
def get_user_entities(current_user: User = Depends(oauth2.get_current_user),
                      db: Session = Depends(PostgresDB.get_db)):
    entities = db.query(models.Entity).filter(
        models.Entity.owner_id == current_user.id).all()
    return [EntityResponse.from_orm(entity) for entity in entities]


@entities2.put("/upload/{id}", status_code=status.HTTP_200_OK)
async def upload_image(id: UUID, file: UploadFile = File(...), current_user: User = Depends(oauth2.get_current_user),
                       db: Session = Depends(PostgresDB.get_db)):
    entity = db.query(models.Entity).filter(models.Entity.id == id,
                                            models.Entity.owner_id == current_user.id).first()

    if not entity:
        raise HTTPException(
            status_code=404, detail=f"The entity with the id {id} can not be found")

    if file.content_type not in ["image/png", "image/jpeg"]:
        raise HTTPException(status_code=422, detail="File must be PNG or JPEG")

    file_content = await file.read()

    image = models.Image(filename=file.filename,
                         content=file_content, entity_id=entity.id)

    db.add(image)
    db.commit()
    db.refresh(image)

    return image.id


@entities2.get("/download/{entity_id}/{image_id}", status_code=status.HTTP_200_OK)
async def download_image(entity_id: UUID, image_id: UUID, db: Session = Depends(PostgresDB.get_db)):
    image = db.query(models.Image).filter(models.Image.id == image_id,
                                          models.Image.entity_id == entity_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="File not found")

    image_type: str = "image/" + image.filename.split(".")[1]
    return StreamingResponse(BytesIO(image.content), media_type=image_type)


@entities2.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entity(id: UUID, current_user: User = Depends(oauth2.get_current_user),
                        db: Session = Depends(PostgresDB.get_db)):
    entity = db.query(models.Entity).filter(models.Entity.id == id,
                                            models.Entity.owner_id == current_user.id)

    if not entity.first():
        raise HTTPException(
            status_code=404, detail=f"The entity with the id {id} can not be found")

    entity.delete(synchronize_session=False)
    db.commit()    
    return "Entity deleted successfully"