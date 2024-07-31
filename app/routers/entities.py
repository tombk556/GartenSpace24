from fastapi import APIRouter, Depends, status
from ..db.mongodb import get_db
from ..models.usermodels import User
from ..models.entitymodels import Entity, EntityResponse
from pymongo.collection import Collection
from .. import oauth2

router = APIRouter(
    prefix="/entities",
    tags=["Entities"])


@router.post("/create_entity", status_code=status.HTTP_201_CREATED)
def create_entity(entity: Entity, current_user: User = Depends(oauth2.get_current_user), db: Collection = Depends(get_db)):
    entity.userId = str(current_user.id)
    db["entities"].insert_one(entity.model_dump())

    return entity


@router.get("/get_entities", response_model=list[EntityResponse])
def get_entities(db: Collection = Depends(get_db)):
    entities = db["entities"].find({"address": {"$exists": True}})

    return entities