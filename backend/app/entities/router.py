from app import models
from app.auth import oauth2
from app.db import PostgresDB
from app.auth.schemas import User
from app.entities.schemas import EntityModel, EntityResponse

from uuid import UUID
from io import BytesIO
from fastapi import Query
from typing import Optional
from sqlalchemy import or_, and_, case
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException

entities = APIRouter(
    prefix="/entities",
    tags=["Entities"])


@entities.post("/create_entity", status_code=status.HTTP_201_CREATED)
def create_entity(entity: EntityModel, current_user: User = Depends(oauth2.get_current_user),
                  db: Session = Depends(PostgresDB.get_db)):
    entity = models.Entity(**entity.to_flat_dict(owner_id=current_user.id))

    db.add(entity)
    db.commit()
    db.refresh(entity)

    return {"id": entity.id}


@entities.get("/get_all_entities", status_code=status.HTTP_200_OK)
def get_all_entities(
    db: Session = Depends(PostgresDB.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    search: Optional[str] = Query(None, description="PLZ, Stadt oder Land"),
    offer: Optional[str] = Query(None, description="Mieten, Kaufen, Pachten etc.")
):
    query = db.query(models.Entity)

    if search:
        
        parts = [p.strip() for p in search.split(",")]
        
        if len(parts) == 3:
            city, plz, country = parts
            
            query = query.filter(
                and_(
                    models.Entity.city.ilike(f"%{city}%"),
                    models.Entity.plz.ilike(f"%{plz}%"),
                    models.Entity.country.ilike(f"%{country}%")
                )
            )

        else:
            query = query.filter(
                or_(
                    models.Entity.city.ilike(f"%{search}%"),
                    models.Entity.plz.ilike(f"%{search}%"),
                    models.Entity.country.ilike(f"%{search}%")
                )
            )

    if offer:
        query = query.order_by(
            case(
                (models.Entity.offer == offer, 0),
                else_=1
            ),
            models.Entity.offer
        )
        
    total_count = query.count()  # Total matching records

    entities = query.offset(skip).limit(limit).all()
    
    return {"entities": [EntityResponse.from_orm(entity) for entity in entities], "total_count": total_count}



@entities.get("/get_entity/{id}", status_code=status.HTTP_200_OK)
def get_entity(id: UUID, db: Session = Depends(PostgresDB.get_db)):
    entity = db.query(models.Entity).filter(models.Entity.id == id).first()

    if not entity:
        raise HTTPException(
            status_code=404, detail=f"The entity with the id {id} cannot be found"
        )
    return EntityResponse.from_orm(entity)


@entities.get("/get_user_entities", status_code=status.HTTP_200_OK, response_model=list[EntityResponse])
def get_user_entities(current_user: User = Depends(oauth2.get_current_user),
                      db: Session = Depends(PostgresDB.get_db)):
    entities = db.query(models.Entity).filter(
        models.Entity.owner_id == current_user.id).all()
    return [EntityResponse.from_orm(entity) for entity in entities]


@entities.put("/upload/{id}", status_code=status.HTTP_200_OK)
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


@entities.get("/download/{entity_id}/{image_id}", status_code=status.HTTP_200_OK)
async def download_image(entity_id: UUID, image_id: UUID, db: Session = Depends(PostgresDB.get_db)):
    image = db.query(models.Image).filter(models.Image.id == image_id,
                                          models.Image.entity_id == entity_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="File not found")

    image_type: str = "image/" + image.filename.split(".")[1]
    return StreamingResponse(BytesIO(image.content), media_type=image_type)


@entities.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
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
