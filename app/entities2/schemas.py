from pydantic import BaseModel, Field, UUID4
from typing import List, Optional

class EntityModel(BaseModel):
    owner_id: Optional[UUID4] = None
    country: str
    city: str
    plz: int
    street: str
    type: str
    size: int
    price: float
    offer: str
    attributes: List[str]
    description: str

