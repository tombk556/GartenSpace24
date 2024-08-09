from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import postgrestables
from .routers import auth, entities, googleauth
from .middleware import SecurityHeadersMiddleware, RateLimitMiddleware
from .db.postgres import engine
from starlette.middleware.sessions import SessionMiddleware
from .config import settings

postgrestables.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
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

app.include_router(auth.router)
app.include_router(entities.router)
app.include_router(googleauth.router)