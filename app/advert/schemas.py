from app import models
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, UUID4, field_validator
from app.entities.schemas import Address


class Type(str, Enum):
    Gütle = "Gütle"
    Schrebergarten = "Schrebergarten"
    Kleingarten = "Kleingarten"


class Offer(str, Enum):
    Mieten = "Mieten"
    Kaufen = "Kaufen"
    Pachten = "Pachten"


class Property(str, Enum):
    Schuppen = "Schuppen"
    Grillstelle = "Grillstelle"
    Garage = "Garage"
    Garten = "Garten"
    Swimmingpool = "Swimmingpool"
    Balkon = "Balkon"
    Carport = "Carport"
    Fitnessraum = "Fitnessraum"
    Terrasse = "Terrasse"
    Kamin = "Kamin"
    Spielplatz = "Spielplatz"


class AdvertModel(BaseModel):
    owner_id: Optional[UUID4] = None
    plz: str
    city: str
    country: str
    type: Type
    offer: Offer
    attributes: List[Property]
    description: Optional[str] = Field(..., max_length=200)

    @field_validator("plz")
    def validate_plz_length(cls, value):
        if value is not None and (len(value) != 5):
            raise ValueError("PLZ must be exactly 5 digits long.")
        return value
    
    
class AdvertResponse(BaseModel):
    id: UUID4
    date: str
    username: str
    email: str
    city: str
    plz: str
    country: str
    attributes: List[str]
    description: str
    
    class Config:
        from_attributes = True
        
    @classmethod
    def from_orm(cls, advert: models.Advert):
        
        attribute_list = [prop for prop in advert.attributes]

        return cls(
            id=str(advert.id),
            date=str(advert.created_at),
            username=advert.user.username,
            email=advert.user.email,
            city=advert.city,
            plz=advert.plz,
            country=advert.country,
            description=advert.description,
            attributes=attribute_list
        )