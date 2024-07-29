from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import postgrestables
from .routers import auth
from .utils import SecurityHeadersMiddleware
from .db.postgres import engine

postgrestables.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Server is Running"}

app.include_router(auth.router)
