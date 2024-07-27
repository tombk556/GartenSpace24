from dotenv import load_dotenv
import os
from fastapi_mail import ConnectionConfig

load_dotenv()


class Settings:
    def __init__(self):
        self.secret_key = os.getenv("SECRET_KEY")
        self.algorithm = os.getenv("ALGORITHM")
        self.access_token_expire_minutes = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
        self.api = os.getenv("API")
        self.model = os.getenv("MODEL")


class PsqlCred:
    def __init__(self):
        self.database_url_psql = os.getenv("DATABASE_URL_PSQL")
        self.test_database_url_psql = os.getenv("TEST_DATABASE_URL_PSQL")
        self.host_psql = os.getenv("HOST_PSQL")
        self.db_psql = os.getenv("DB_PSQL")
        self.pw_psql = os.getenv("PW_PSQL")
        self.user_psql = os.getenv("USER_PSQL")


class MdbCred:
    def __init__(self):
        self.mongodb_uri = os.getenv("MONGODB_URI")


settings = Settings()
psql = PsqlCred()
modb = MdbCred()