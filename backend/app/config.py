import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self):
        self.secret_key = os.getenv("SECRET_KEY")
        self.algorithm = os.getenv("ALGORITHM")
        self.access_token_expire_minutes = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
        self.cred_file = os.getenv("CRED_FILE")
        self.frontend_url = os.getenv("FRONTEND_URL")
        self.backend_url = os.getenv("BACKEND_URL")


class PsqlCred:
    def __init__(self):
        self.database_url_psql = os.getenv("DATABASE_URL_PSQL")
        self.test_database_url_psql = os.getenv("TEST_DATABASE_URL_PSQL")


settings = Settings()
psql = PsqlCred()