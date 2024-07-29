import psycopg2
import time
from .config import psql
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from time import time

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['X-XSS-Protection'] = '1; mode=block'
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