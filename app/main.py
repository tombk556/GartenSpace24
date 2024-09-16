from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .entities.router import entities
from .auth.router import auth
from .google.router import google

from . import models
from .db import engine
from starlette.middleware.sessions import SessionMiddleware
from .config import settings

models.Base.metadata.create_all(bind=engine)

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


app.include_router(auth)
app.include_router(entities)
app.include_router(google)