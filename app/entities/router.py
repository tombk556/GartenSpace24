from app.db import MongoDB
from app.auth import oauth2
from app.auth.schemas import User
from app.entities.schemas import Entity, EntityResponse

from bson import ObjectId
from bson.errors import InvalidId
from gridfs import GridFS
from pymongo.collection import Collection
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException

entities = APIRouter(
    prefix="/entities",
    tags=["Entities"])


@entities.post("/create_entity", status_code=status.HTTP_201_CREATED)
def create_entity(entity: Entity, current_user: User = Depends(oauth2.get_current_user), db: Collection = Depends(MongoDB.get_db)):
    entity.userId = str(current_user.id)
    entity.email = current_user.email
    entity.username = current_user.username
    result = db["entities"].insert_one(entity.model_dump())
    return str(result.inserted_id)


@entities.get("/get_all_entities", response_model=list[EntityResponse])
def get_all_entities(db: Collection = Depends(MongoDB.get_db)):
    entities = db["entities"].find({"address": {"$exists": True}})

    return entities

@entities.get("/get_entity/{id}", response_model=Entity)
def get_entity(id: str, db: Collection = Depends(MongoDB.get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=422, detail=f"The id {id} is not a valid ObjectId")
    
    entity = db["entities"].find_one({'_id': ObjectId(id)})
    if entity:
        entity['_id'] = str(entity['_id'])
        return entity
    else:
        raise HTTPException(status_code=404, detail=f"The entity with the id {id} can not be found")

@entities.put("/upload/{entity_id}")
async def upload_image(entity_id: str, file: UploadFile = File(...), current_user: User = Depends(oauth2.get_current_user), 
                       fs: GridFS = Depends(MongoDB.get_fs), db: Collection = Depends(MongoDB.get_db)):
    if not ObjectId.is_valid(entity_id):
        raise HTTPException(status_code=422, detail=f"The id {entity_id} is not a valid ObjectId")
    
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to upload image for this entity")
    
    user_id = db["entities"].find_one({"_id": ObjectId(entity_id)})["userId"]
    
    file_content = await file.read()
    file_id = fs.put(file_content, filename=file.filename, metadata={"entity_id": entity_id})
    db["entities"].update_one({"_id": ObjectId(entity_id)}, {
                              "$set": {f"images.{file.filename}": str(file_id)}})
    return {"file_id": str(file_id), "entity_id": entity_id}


@entities.get("/download/{entity_id}/{file_id}")
async def download_image(entity_id: str, file_id: str, fs: GridFS = Depends(MongoDB.get_fs)):
    try:
        grid_out = fs.get(ObjectId(file_id))
        
        if grid_out.metadata.get("entity_id") != entity_id:
            raise HTTPException(status_code=404, detail="File not found for the given entity")
        
        return StreamingResponse(grid_out, media_type="image/png")
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")