import re
import random
import string
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, computed_field


def random_password(n: int = 30) -> str:
    return ''.join(random.choice(string.digits + string.ascii_letters) for _ in range(n))


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., pattern=r"^[a-zA-Z0-9-' ]+$")
    password: str = Field(min_length=8, max_length=100)
    google_account: Optional[bool] = Field(default=False)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "newusername",
                "password": "Password123!",
                "name": "username",
                "age": 18
            }}

    @field_validator("password")
    def password_validator(cls, value):
        if not re.match(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$", value):
            raise ValueError(
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        return value


class UserUpdate(BaseModel):
    email: EmailStr
    username: str = Field(..., pattern=r"^[a-zA-Z0-9-' ]+$")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "updateduser@example.com",
                "username": "newupdatedusername"
            }}


class GoogleUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100,
                          default=random_password())
    google_account: bool = Field(default=True)

    @computed_field
    @property
    def username(self) -> str:
        return self.email.split('@')[0]


class User(BaseModel):
    id: UUID
    email: EmailStr
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None
