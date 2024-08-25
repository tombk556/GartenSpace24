from fastapi import FastAPI, Cookie
from fastapi.middleware.cors import CORSMiddleware
from .db import postgrestables
from .routers import auth, entities, googleauth
from .db.postgres import engine
from starlette.middleware.sessions import SessionMiddleware
from .config import settings

postgrestables.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

@app.get("/")
def root():
    return {"message": "Server is Running"}


@app.get("/check-token")
def get_token(access_token: str = Cookie(None)):
    return {"token": access_token}

app.include_router(auth.router)
app.include_router(entities.router)
app.include_router(googleauth.router)