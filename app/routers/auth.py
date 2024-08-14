from fastapi import APIRouter, Depends, status, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..models import usermodels
from ..db import postgres, postgrestables
from .. import utils, oauth2
from ..db.postgres import get_db


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"])


@router.post("/sign_up", status_code=status.HTTP_201_CREATED, response_model=usermodels.User)
def create_user(user: usermodels.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(postgrestables.User).filter(
        (postgrestables.User.email == user.email) | (postgrestables.User.username == user.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exist"
        )

    user.password = utils.hash(user.password)
    new_user = postgrestables.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.delete("/delete_user", status_code=status.HTTP_204_NO_CONTENT)
def delte_user(current_user: usermodels.User = Depends(oauth2.get_current_user), db: Session = Depends(get_db),
               token: str = Depends(oauth2.get_access_token)):
    existing_user = db.query(postgrestables.User).filter(
        postgrestables.User.id == current_user.id)
    existing_user.delete(synchronize_session=False)
    db.commit()

    banned_token = postgrestables.BannedTokens(token=token)
    db.add(banned_token)
    db.commit()
    return 204


@router.put("/update_user_infos", response_model=usermodels.User)
def update_user(update_user: usermodels.UserUpdate, current_user: usermodels.User = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    existing_user = db.query(postgrestables.User).filter(
        ((postgrestables.User.email == update_user.email)
         & (postgrestables.User.id != current_user.id))
        | ((postgrestables.User.username == update_user.username) & (postgrestables.User.id != current_user.id))).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email and/or Username is/are already taken"
        )

    user = db.query(postgrestables.User).filter(
        postgrestables.User.id == current_user.id)
    user.update(update_user.model_dump(), synchronize_session=False)
    db.commit()

    return user.first()


@router.post("/login")
def login(user_credentials: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(postgres.get_db)):
    user = db.query(postgrestables.User).filter(
        (postgrestables.User.email == user_credentials.username) |
        (postgrestables.User.username == user_credentials.username)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User does not exist")

    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = oauth2.create_access_token(data={"user_id": str(user.id)})

    response = JSONResponse(content={"message": "Successfully logged in"})
    response.set_cookie(key="access_token", samesite="None",
                        value=access_token)
    return response


@router.get("/users/me", response_model=usermodels.User)
async def get_user(current_user: usermodels.User = Depends(oauth2.get_current_user)):
    return current_user
