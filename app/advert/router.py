from app import models
from app.auth import oauth2
from app.db import PostgresDB
from app.auth.schemas import User
from app.advert.schemas import AdvertModel, AdvertResponse

from uuid import UUID
from io import BytesIO
from fastapi import Query
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException

advert = APIRouter(
    prefix="/advert",
    tags=["Advert"])


@advert.post("/create_advert", status_code=status.HTTP_201_CREATED)
def create_advert(advert: AdvertModel, current_user: User = Depends(oauth2.get_current_user),
                  db: Session = Depends(PostgresDB.get_db)):
    advert.owner_id = current_user.id
    new_advert = models.Advert(**advert.model_dump())

    db.add(new_advert)
    db.commit()
    db.refresh(new_advert)

    return {"id": new_advert.id}


@advert.get("/get_all_adverts", status_code=status.HTTP_200_OK, response_model=list[AdvertResponse])
def get_all_adverts(db: Session = Depends(PostgresDB.get_db), skip: int = Query(0, ge=0),
                    limit: int = Query(10, ge=1)):
    adverts = (db.query(models.Advert).offset(skip).limit(limit).all())
    return [AdvertResponse.from_orm(advert) for advert in adverts]


@advert.get("/get_advert/{id}", status_code=status.HTTP_200_OK)
def get_advert(id: UUID, db: Session = Depends(PostgresDB.get_db)):
    advert = db.query(models.Advert).filter(models.Advert.id == id).first()

    if not advert:
        raise HTTPException(
            status_code=404, detail=f"The advert with the id {id} cannot be found"
        )
    return AdvertResponse.from_orm(advert)


@advert.get("/get_user_adverts", status_code=status.HTTP_200_OK, response_model=list[AdvertResponse])
def get_user_adverts(current_user: User = Depends(oauth2.get_current_user),
                     db: Session = Depends(PostgresDB.get_db)):
    adverts = db.query(models.Advert).filter(
        models.Advert.owner_id == current_user.id).all()
    return [AdvertResponse.from_orm(advert) for advert in adverts]

@advert.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_advert(id: UUID, current_user: User = Depends(oauth2.get_current_user),
                  db: Session = Depends(PostgresDB.get_db)):
    advert = db.query(models.Advert).filter(models.Advert.id == id,
                                            models.Advert.owner_id == current_user.id)

    if not advert.first():
        raise HTTPException(
            status_code=404, detail=f"The advert with the id {id} can not be found")

    advert.delete(synchronize_session=False)
    db.commit()
    return "Advert deleted successfully"