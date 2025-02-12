from app import models
from app.auth import oauth2
from app.db import PostgresDB
from app.google import schemas
from app.config import settings
from app.auth.oauth2 import get_google_oauth2_flow

import os
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from fastapi import APIRouter, Request, HTTPException, Depends, status

google = APIRouter(
    tags=["Google"])

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


@google.get("/login/google")
async def login_google(request: Request):
    flow = get_google_oauth2_flow()
    authorization_url, state = flow.authorization_url(prompt='select_account')
    request.session['state'] = state
    return RedirectResponse(authorization_url)


@google.get("/google/auth", response_model=schemas.Token)
async def auth_google(request: Request, db: Session = Depends(PostgresDB.get_db)):
    flow = get_google_oauth2_flow()
    flow.fetch_token(authorization_response=request.url._url)

    credentials: Credentials = flow.credentials
    request.session['google_access_token'] = credentials.token

    from googleapiclient.discovery import build
    service = build('oauth2', 'v2', credentials=credentials)
    user_info = service.userinfo().get().execute()
    if not user_info:
        raise HTTPException(
            status_code=400, detail="Failed to retrieve user information.")

    try:
        access_token = check_user_and_create_token(user_info, db)
        redirect_url = f"{settings.frontend_url}/authgoogle/callback?token={access_token}"
        return RedirectResponse(url=redirect_url)
    except HTTPException as e:
        if e.status_code == status.HTTP_409_CONFLICT:
            error_message = e.detail
            redirect_url = f"{settings.frontend_url}/login?error={error_message}"
            return RedirectResponse(url=redirect_url)
        else:
            raise e

@google.get("/logout/google")
async def logout_google(request: Request):
    request.session.clear()
    return RedirectResponse(url="/")


def check_user_and_create_token(user_info, db: Session) -> str:
    user_name = user_info["email"].split("@")[0]
    existing_user = db.query(models.User).filter(
        (models.User.email == user_info['email'])
        | (models.User.username == user_name)
        ).first()

    if existing_user and existing_user.google_account:
        user_id = existing_user.id
    elif not existing_user:
        user = schemas.GoogleUserCreate(**user_info)
        user.password = oauth2.hash(user.password)
        new_user = models.User(**user.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user_id = new_user.id
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="""There is already an gmail account with this email address or user name. 
                      Please login with your email and password."""
        )
    access_token = oauth2.create_access_token(data={"user_id": str(user_id)})
    return access_token
