from enum import Enum
from app import models
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field, UUID4, field_validator


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


class Country(str, Enum):
    BadenWtrttemberg = "Baden-Württemberg"
    Bayern = "Bayern"
    Berlin = "Berlin"
    Brandenburg = "Brandenburg"
    Bremen = "Bremen"
    Hamburg = "Hamburg"
    Hessen = "Hessen"
    MecklenburgVorpommern = "Mecklenburg-Vorpommern"
    Niedersachsen = "Niedersachsen"
    NordrheinWestfalen = "Nordrhein-Westfalen"
    RheinlandPfalz = "Rheinland-Pfalz"
    Saarland = "Saarland"
    Sachsen = "Sachsen"
    SachsenAnhalt = "Sachsen-Anhalt"
    SchleswigHolstein = "Schleswig-Holstein"
    Thueringen = "Thueringen"



class Address(BaseModel):
    country: Country
    city: str = Field(..., max_length=52)
    plz: str = Field(..., pattern=r"^\d{5}$",
                     min_length=5, max_length=5)
    street: str = Field(..., max_length=52)


class Meta(BaseModel):
    size: int
    price: Optional[Decimal] = Field(ge=0.01, le=1000_000.00, decimal_places=2)
    offer: Offer
    description: Optional[str] = Field(..., max_length=100)
    
    @field_validator("price", mode="before")
    def convert_comma_to_dot(cls, v):
        if isinstance(v, str):
            return v.replace(",", ".")
        return v


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
