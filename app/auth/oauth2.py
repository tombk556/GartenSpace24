from app import models
from app.auth import schemas
from app.db import PostgresDB
from app.config import settings

import os
from typing import Dict
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from google_auth_oauthlib.flow import Flow
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
CRED_FILE = settings.cred_file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
CRED_PATH = os.path.join(PROJECT_ROOT, "google-credentials.json")

def get_google_oauth2_flow() -> Flow:
    return Flow.from_client_secrets_file(
        client_secrets_file=CRED_PATH,
        scopes=['openid',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'],
        redirect_uri=f'{settings.backend_url}/google/auth'
    )

def hash(password: str):
    return pwd_context.hash(password)

def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: Dict[str, any]):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire.timestamp()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def verify_access_token(token: str, credential_exception, db: Session):
    is_banned = db.query(models.BannedTokens).filter(
        models.BannedTokens.token == token).first() is not None
    if is_banned:
        raise credential_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("user_id")
        if id is None:
            raise credential_exception
        token_data = schemas.TokenData(id=id)

    except JWTError:
        raise credential_exception

    return token_data

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(PostgresDB.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    token_data = verify_access_token(token, credentials_exception, db)
    user = db.query(models.User).filter(
        models.User.id == token_data.id).first()
    if not user:
        raise credentials_exception
    return user