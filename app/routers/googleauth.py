from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import os


router = APIRouter()
root_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


def get_google_oauth2_flow() -> Flow:
    return Flow.from_client_secrets_file(
        client_secrets_file=os.path.join(root_path, 'google-credentials.json'),
        scopes=['openid',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'],
        redirect_uri='http://localhost:8000/google/auth'
    )


@router.get("/login/google")
async def login_via_google(request: Request):
    flow = get_google_oauth2_flow()
    authorization_url, state = flow.authorization_url(prompt='select_account')
    request.session['state'] = state
    return RedirectResponse(authorization_url)


@router.get("/google/auth")
async def auth_via_google(request: Request):
    state = request.session.pop('state', None)
    flow = get_google_oauth2_flow()
    flow.fetch_token(authorization_response=request.url._url)

    credentials: Credentials = flow.credentials
    request.session['access_token'] = credentials.token

    from googleapiclient.discovery import build
    service = build('oauth2', 'v2', credentials=credentials)
    user_info = service.userinfo().get().execute()
    print(user_info)
    if not user_info:
        raise HTTPException(
            status_code=400, detail="Failed to retrieve user information.")

    return RedirectResponse(url="/")


@router.get("/logout/google")
async def logout_google(request: Request):
    request.session.clear()
    return RedirectResponse(url="/")
