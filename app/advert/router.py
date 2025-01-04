from app import models
from app.auth import oauth2
from app.db import PostgresDB
from app.auth.schemas import User
from app.advert.schemas import AdvertModel

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