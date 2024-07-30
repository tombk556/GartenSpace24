from fastapi import APIRouter, Depends, status
from ..db.mongodb import get_db
from ..models.usermodels import User
from pymongo.collection import Collection
from .. import oauth2

router = APIRouter(
    prefix="/entities",
    tags=["Entities"])

@router.post("/create_entity", status_code=status.HTTP_201_CREATED)
def create_entity(user: User = Depends(oauth2.get_current_user), db: Collection = Depends(get_db)):
    db["entities"].insert_one({"name": "entity"})
