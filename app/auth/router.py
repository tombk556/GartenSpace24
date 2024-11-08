from app import models
from app.db import PostgresDB, MongoDB
from app.auth import oauth2, schemas

from gridfs import GridFS
from sqlalchemy.orm import Session
from pymongo.collection import Collection
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

auth = APIRouter(
    prefix="/auth",
    tags=["Authentication"])


@auth.post("/sign_up", status_code=status.HTTP_201_CREATED, response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(PostgresDB.get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exist"
        )

    user.password = oauth2.hash(user.password)
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@auth.delete("/delete_user")
def delte_user(current_user: schemas.User = Depends(oauth2.get_current_user), db: Session = Depends(PostgresDB.get_db),
               token: str = Depends(oauth2.oauth2_scheme), mdb: Collection = Depends(MongoDB.get_db), 
               fs: GridFS = Depends(MongoDB.get_fs)):

    existing_user = db.query(models.User).filter(
        models.User.id == current_user.id)
    
    if existing_user.first():
        entities = mdb["entities"].find({"userId" : str(current_user.id)})
        images = [entity["images"] for entity in entities]

    if entities:
        mdb["entities"].delete_many({"userId" : str(current_user.id)})
    
    if images:    
        img_ids = [item['png'] for group in images for item in group.values() if 'png' in item]
        
        if img_ids:
            for img_id in img_ids:
                fs.delete(img_id)
        
    existing_user.delete(synchronize_session=False)
    db.commit()

    banned_token = models.BannedTokens(token=token)
    db.add(banned_token)
    db.commit()
    return 204


@auth.put("/update_user_infos", response_model=schemas.User)
def update_user(update_user: schemas.UserUpdate, current_user: schemas.User = Depends(oauth2.get_current_user), db: Session = Depends(PostgresDB.get_db)):
    existing_user = db.query(models.User).filter(
        ((models.User.email == update_user.email)
         & (models.User.id != current_user.id))
        | ((models.User.username == update_user.username) & (models.User.id != current_user.id))).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email and/or Username is/are already taken"
        )

    user = db.query(models.User).filter(
        models.User.id == current_user.id)
    user.update(update_user.model_dump(), synchronize_session=False)
    db.commit()

    return user.first()


@auth.post("/login", response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(PostgresDB.get_db)):
    user = db.query(models.User).filter(
        (models.User.email == user_credentials.username) |
        (models.User.username == user_credentials.username)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User does not exist")

    if not oauth2.verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = oauth2.create_access_token(data={"user_id": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


@auth.get("/users/me", response_model=schemas.User)
async def get_user(current_user: schemas.User = Depends(oauth2.get_current_user)):
    return current_user