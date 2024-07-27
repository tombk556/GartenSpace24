import psycopg2
import time
from .config import psql
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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