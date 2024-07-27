from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import postgrestables
from .routers import auth
from .db.postgres import engine

postgrestables.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Server is Running"}


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(auth.router)
