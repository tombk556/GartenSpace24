from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from ..oauth2 import get_google_oauth2_flow
from ..db import postgrestables
from ..db.postgres import get_db
from ..models import usermodels
import os

router = APIRouter()
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


@router.get("/login/google")
async def login_google(request: Request):
    flow = get_google_oauth2_flow()
    authorization_url, state = flow.authorization_url(prompt='select_account')
    request.session['state'] = state
    return RedirectResponse(authorization_url)


@router.get("/google/auth")
async def auth_google(request: Request, db: Session = Depends(get_db)):
    flow = get_google_oauth2_flow()
    flow.fetch_token(authorization_response=request.url._url)

    credentials: Credentials = flow.credentials
    request.session['access_token'] = credentials.token

    from googleapiclient.discovery import build
    service = build('oauth2', 'v2', credentials=credentials)
    user_info = service.userinfo().get().execute()
    if not user_info:
        raise HTTPException(
            status_code=400, detail="Failed to retrieve user information.")
    
    email = user_info['email']
    existing_user = db.query(postgrestables.User).filter(
        postgrestables.User.email == email).first()
    
    if existing_user:
        user_id = existing_user.id
        return {"message": "Google Account already present -> login",
                "user_id": user_id}
        
    else:
        user = usermodels.GoogleUserCreate(**user_info)
        new_user = postgrestables.User(**user.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"message": "Google Account created -> register"}
        
        
    


@router.get("/logout/google")
async def logout_google(request: Request):
    request.session.clear()
    return RedirectResponse(url="/")
