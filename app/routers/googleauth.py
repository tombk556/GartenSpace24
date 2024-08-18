from fastapi import APIRouter, Request, HTTPException, Depends, status
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from ..oauth2 import get_google_oauth2_flow
from ..db import postgrestables
from ..db.postgres import get_db
from ..models import usermodels
from ..config import settings
import os
from .. import utils, oauth2

router = APIRouter()
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


@router.get("/login/google")
async def login_google(request: Request):
    flow = get_google_oauth2_flow()
    authorization_url, state = flow.authorization_url(prompt='select_account')
    request.session['state'] = state
    return RedirectResponse(authorization_url)


@router.get("/google/auth", response_model=usermodels.Token)
async def auth_google(request: Request, db: Session = Depends(get_db)):
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

    access_token = check_user_and_create_token(user_info, db)

    redirect_url = f"{settings.frontend_url}/google/callback?token={access_token}"
    return RedirectResponse(url=redirect_url)

@router.get("/logout/google")
async def logout_google(request: Request):
    request.session.clear()
    return RedirectResponse(url="/")


def check_user_and_create_token(user_info, db: Session) -> str:
    existing_user = db.query(postgrestables.User).filter(
        postgrestables.User.email == user_info['email']).first()

    if existing_user and existing_user.google_account:
        user_id = existing_user.id
    elif not existing_user:
        user = usermodels.GoogleUserCreate(**user_info)
        user.password = utils.hash(user.password)
        new_user = postgrestables.User(**user.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user_id = new_user.id
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="There is already an gmail account with this email address. Please login with your email and password."
        )
    access_token = oauth2.create_access_token(data={"user_id": str(user_id)})
    return access_token
