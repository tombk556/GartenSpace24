from pydantic import BaseModel, Field, field_validator, root_validator
from fastapi import HTTPException, status
from datetime import datetime
from bson import ObjectId
from typing import Optional, Dict
from enum import Enum
from uuid import UUID

class Address(BaseModel):
    country: str
    city: str
    plz: str
    street: str

class Type(str, Enum):
    house = "house"
    flat = "flat"
    office = "office"
    land = "land"

class Meta(BaseModel):
    type: Type
    size: str = Field(..., pattern=r'^\d+m²$')
    rooms: Optional[int] = Field(None, description="Number of rooms")
    price: str = Field(..., pattern=r'^\d+€$')
    description: str

class Entity(BaseModel):
    userId: Optional[str] = None
    date: datetime = Field(default_factory=datetime.now)
    address: Address
    meta: Meta
    properties: Optional[Dict] = None
    
    @field_validator("userId", mode="after")
    def validate_userId(cls, value):
        try:
            UUID(value)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="userId must be a valid ObjectId")
        return value
    
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
    address: Address
    meta: Meta
    properties: Optional[Dict] = None
    
    @field_validator("id", mode="before")
    def validate_object_id(cls, value):
        try:
            obj_id = ObjectId(value)
            return str(obj_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="Invalid ObjectId")
            