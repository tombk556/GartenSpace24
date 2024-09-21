from enum import Enum
from uuid import UUID
from bson import ObjectId
from datetime import datetime
from typing import Optional, Dict
from fastapi import HTTPException, status
from pydantic import BaseModel, Field, field_validator, validator, EmailStr


class Address(BaseModel):
    country: str
    city: str
    plz: str
    street: str


class Type(str, Enum):
    Gütle = "Gütle"
    Schrebergarten = "Schrebergarten"
    Kleingarten = "Kleingarten"


class Meta(BaseModel):
    type: Type
    size: int
    price: float
    description: str


class Entity(BaseModel):
    userId: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    date: datetime = Field(default_factory=datetime.now)
    address: Address
    meta: Meta
    properties: Optional[list[str]] = []
    images: Optional[Dict[str, str]] = {}

    @field_validator("userId", mode="after")
    def validate_userId(cls, value):
        try:
            UUID(value)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="userId must be a valid ObjectId")
        return value

    @validator("images", pre=True, always=True)
    def validate_images(cls, value):
        return parse_images(value)

    class Config:
        json_encoders = {
            ObjectId: lambda x: str(x)
        }

        use_enum_values = True

        json_schema_extra = {
            "address": {
                "country": "Musterland",
                "city": "Musterstadt",
                "plz": "12345",
                "street": "Musterstraße"
            },
            "meta": {
                "type": "house",
                "size": "100m²",
                "rooms": 4,
                "price": "100000€",
                "description": "This is a beautiful house"
            },
            "properties": {
                "garden": True,
                "garage": True
            }
        }


class EntityResponse(BaseModel):
    id: str = Field(..., alias="_id")
    meta: Meta
    address: Address
    images: Optional[Dict[str, str]] = {}

    @field_validator("id", mode="before")
    def validate_object_id(cls, value):
        try:
            obj_id = ObjectId(value)
            return str(obj_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="Invalid ObjectId")

    @validator("images", pre=True, always=True)
    def validate_images(cls, value):
        return parse_images(value)


def parse_images(value: Optional[Dict]) -> Optional[Dict[str, str]]:
    if isinstance(value, dict):
        images_dict = {k: v["png"] for k, v in value.items() if "png" in v}
        return images_dict
    elif value == {}:
        return value
    else:
        raise ValueError(
            "Images should be a dictionary where keys are image IDs and values are image paths")
