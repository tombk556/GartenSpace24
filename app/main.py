from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import postgrestables
from .routers import auth
from .db.postgres import engine
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

postgrestables.Base.metadata.create_all(bind=engine)

app = FastAPI()

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response

app.add_middleware(SecurityHeadersMiddleware)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Server is Running"}

app.include_router(auth.router)
