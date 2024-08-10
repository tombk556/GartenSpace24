from jose import JWTError, jwt
from datetime import datetime, timedelta
from .models import usermodels
from .db import postgrestables
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .config import settings
from .db.postgres import get_db
from google_auth_oauthlib.flow import Flow

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
CRED_PATH = settings.cred_path


def get_google_oauth2_flow() -> Flow:
    return Flow.from_client_secrets_file(
        client_secrets_file=CRED_PATH,
        scopes=['openid',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'],
        redirect_uri='http://localhost:8000/google/auth'
    )


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_access_token(token: str, credential_exception, db: Session):
    is_banned = db.query(postgrestables.BannedTokens).filter(
        postgrestables.BannedTokens.token == token).first() is not None
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
    token_data = verify_access_token(token, credentials_exception, db)
    user = db.query(postgrestables.User).filter(
        postgrestables.User.id == token_data.id).first()
    if not user:
        raise credentials_exception
    return user
