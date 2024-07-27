from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
import re


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., pattern=r"^[a-zA-Z0-9-' ]+$")
    password: str = Field(min_length=8, max_length=100)
    name: str = Field(..., pattern=r"^[a-zA-Z0-9-' ]+$")
    age: int = Field(gt=17, lt=100)

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
    name: str = Field(..., pattern=r"^[a-zA-Z0-9-' ]+$")
    age: int = Field(gt=17, lt=100)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "updateduser@example.com",
                "username": "newupdatedusername",
                "name": "newupdatedusername",
                "age": 19
            }}


class User(BaseModel):
    id: UUID
    email: EmailStr
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None
