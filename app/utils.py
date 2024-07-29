import psycopg2
import time

from starlette.types import ASGIApp
from .config import psql
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext
from starlette.middleware.base import BaseHTTPMiddleware, DispatchFunction
from time import time
from collections import defaultdict
from fastapi import Response
from typing import Dict

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app) -> None:
        super().__init__(app)
        self.rate_limit_records: Dict[str, float] = defaultdict(float)
        
    async def log_message(self, message):
        print(message)
        
    async def dispatch(self, request, call_next):
        client_ip = request.client.host
        current_time = time()
        if current_time - self.rate_limit_records[client_ip] < 1:
            return Response("Rate limit exceeded", status_code=429)
        
        self.rate_limit_records[client_ip] = current_time
        path = request.url.path
        await self.log_message(f"Client {client_ip} accessed {path}")
        
        start_time = time()
        response = await call_next(request)
        process_time = time() - start_time
        
        custom_header = {"X-Process-Time": str(process_time)}
        for header, value in custom_header.items():
            response.headers.append(header, value)
        
        await self.log_message(f"Response for {path} took {process_time} seconds")
        
        return response

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash(password: str):
    return pwd_context.hash(password)


def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def checkdb():
    while True:
        try:
            psycopg2.connect(host=psql.host_psql,
                             database=psql.db_psql,
                             user=psql.user_psql,
                             password=psql.pw_psql,
                             cursor_factory=RealDictCursor)
            print("Database connection was succesfull!")
            break
        except Exception as error:
            print("Connecting to database failed ", error)
            time.sleep(2)