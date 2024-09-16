from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import schemas
from ..db import PostgresDB
from .. import models, utils, oauth2
from ..db import PostgresDB
from ..oauth2 import oauth2_scheme

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

    user.password = utils.hash(user.password)
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@auth.delete("/delete_user", status_code=status.HTTP_204_NO_CONTENT)
def delte_user(current_user: schemas.User = Depends(oauth2.get_current_user), db: Session = Depends(PostgresDB.get_db),
               token: str = Depends(oauth2_scheme)):

    existing_user = db.query(models.User).filter(
        models.User.id == current_user.id)
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

    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = oauth2.create_access_token(data={"user_id": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


@auth.get("/users/me", response_model=schemas.User)
async def get_user(current_user: schemas.User = Depends(oauth2.get_current_user)):
    return current_user