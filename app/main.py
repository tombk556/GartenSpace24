from app import models
from app.db import engine
from app.config import settings
from app.auth.router import auth
from app.google.router import google
from app.advert.router import advert
from app.entities.router import entities

from fastapi import FastAPI
from app.middleware import RateLimitMiddleware, SlowMiddleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

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
# app.add_middleware(RateLimitMiddleware, max_requests=60, time_window=60)
app.add_middleware(SlowMiddleware)

@app.get("/")
def root():
    return {"message": "Server is Running"}


app.include_router(auth)
app.include_router(google)
app.include_router(entities)
app.include_router(advert)