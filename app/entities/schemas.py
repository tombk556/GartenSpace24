from app import models
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, UUID4, validator


class Address(BaseModel):
    country: str
    city: str
    plz: int
    street: str

    @validator("plz")
    def validate_plz_length(cls, value):
        if value is not None and (len(str(value)) != 5):
            raise ValueError("PLZ must be exactly 5 digits long.")
        return value


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
    Terasse = "Terasse"
    Kamin = "Kamin"
    Spielplatz = "Spielplatz"


class Meta(BaseModel):
    type: Type
    size: int
    price: float
    offer: Offer
    description: Optional[str] = Field(..., max_length=100)


class EntityModel(BaseModel):
    owner_id: Optional[UUID4] = None
    address: Address
    meta: Meta
    properties: List[Property]

    def to_flat_dict(self, owner_id: UUID4) -> dict:
        return {
            "owner_id": owner_id,
            "country": self.address.country,
            "city": self.address.city,
            "plz": self.address.plz,
            "street": self.address.street,
            "type": self.meta.type.value,
            "size": self.meta.size,
            "price": self.meta.price,
            "offer": self.meta.offer.value,
            "attributes": [prop.value for prop in self.properties],
            "description": self.meta.description,
        }

    @classmethod
    def from_orm(cls, query):
        entity: models.Entity = query[0][0]
        user: models.User = query[0][1]
        images: List[models.Image] = [row[2] for row in query if row[2] is not None]
        
        return {
            "userId": user.id,
            "email": user.email,
            "username": user.username,
            "date": entity.created_at,
            "address": Address(
                country=entity.country,
                city=entity.city,
                plz=entity.plz,
                street=entity.street,
            ).model_dump(),
            "meta": Meta(
                type=Type(entity.type),
                size=entity.size,
                price=entity.price,
                offer=Offer(entity.offer),
                description=entity.description 
            ).model_dump(),
            "attributes": list(entity.attributes),
            "images": {image.filename: image.id for image in images}
        }


class EntityResponse(BaseModel):
    id: UUID4
    meta: Meta
    address: Address
    images: dict[str, UUID4]

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, entity: models.Entity):
        images_dict = {
            image.filename: str(image.id)
            for image in entity.images
        }
        return cls(
            id=str(entity.id),
            meta=Meta(
                type=entity.type,
                size=entity.size,
                price=entity.price,
                offer=entity.offer,
                description=entity.description
            ),
            address=Address(
                country=entity.country,
                city=entity.city,
                plz=entity.plz,
                street=entity.street
            ),
            images=images_dict
        )

