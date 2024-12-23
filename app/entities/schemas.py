from app import models
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, UUID4, validator


class Address(BaseModel):
    country: str
    city: str
    plz: str
    street: str

    @validator("plz")
    def validate_plz_length(cls, value):
        if value is not None and (len(value) != 5):
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
    Terrasse = "Terrasse"
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

class EntityResponse(BaseModel):
    id: UUID4
    date: str
    username: str
    email: str
    meta: Meta
    address: Address
    images: dict[str, UUID4]
    attributes: List[str]

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, entity: models.Entity):
        images_dict = {
            image.filename: str(image.id)
            for image in entity.images
        }
        
        attribute_list = [prop for prop in entity.attributes]
        
        return cls(
            id=str(entity.id),
            date=str(entity.created_at),
            username=entity.user.username,
            email=entity.user.email,
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
            images=images_dict,
            attributes=attribute_list
        )

