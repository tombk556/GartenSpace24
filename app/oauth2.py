from jose import JWTError, jwt
from datetime import datetime, timedelta

from .models import usermodels

from .db import postgrestables
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .config import settings
from .db.postgres import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt



def verify_access_token(token: str, credential_exception, db: Session):
    is_banned = db.query(postgrestables.BannedTokens).filter(postgrestables.BannedTokens.token == token).first() is not None
    if is_banned:
        raise credential_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("user_id")
        if id is None:
            raise credential_exception
        token_data = usermodels.TokenData(id=id)
        
    except JWTError:
        raise credential_exception
    
    return token_data
    
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    # Make sure to pass the `db` argument to `verify_access_token`
    token_data = verify_access_token(token, credentials_exception, db)
    user = db.query(postgrestables.User).filter(postgrestables.User.id == token_data.id).first()
    if not user:
        raise credentials_exception
    return user

def get_current_user2(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    # Make sure to pass the `db` argument to `verify_access_token`
    token_data = verify_access_token(token, credentials_exception, db)
    user = db.query(postgrestables.User2).filter(postgrestables.User2.id == token_data.id).first()
    if not user:
        raise credentials_exception
    return user
