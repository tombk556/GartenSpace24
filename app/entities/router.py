from app.db import MongoDB
from app.auth import oauth2
from app.auth.schemas import User
from app.entities.schemas import Entity, EntityResponse

from fastapi import Query
from bson import ObjectId
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
def get_all_entities(db: Collection = Depends(MongoDB.get_db), skip: int = Query(0, ge=0),
                     limit: int = Query(10, ge=1)):
    entities_cursor = db["entities"].find({"address": {"$exists": True}}).sort("_id").skip(skip).limit(limit)
    entities = list(entities_cursor)
    return entities



@entities.get("/get_entity/{id}", response_model=Entity)
def get_entity(id: str, db: Collection = Depends(MongoDB.get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=422, detail=f"The id {id} is not a valid ObjectId")

    entity = db["entities"].find_one({'_id': ObjectId(id)})
    
    if not entity:
        raise HTTPException(
            status_code=404, detail=f"The entity with the id {id} can not be found")
        
    return entity


@entities.put("/upload/{id}")
async def upload_image(id: str, file: UploadFile = File(...), current_user: User = Depends(oauth2.get_current_user),
                       fs: GridFS = Depends(MongoDB.get_fs), db: Collection = Depends(MongoDB.get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=422, detail=f"The id {id} is not a valid ObjectId")

    entity: dict = db["entities"].find_one({"_id": ObjectId(id)})
    
    if not entity:
        raise HTTPException(
            status_code=404, detail=f"The entity with the id {id} can not be found")

    if str(current_user.id) != entity.get("userId"):
        raise HTTPException(
            status_code=403, detail="You are not authorized to delete this entity")

    file_content = await file.read()
    file_id = fs.put(file_content, filename=file.filename,
                     metadata={"entity_id": id})
    db["entities"].update_one({"_id": ObjectId(id)}, {
                              "$set": {f"images.{file.filename}": str(file_id)}})
    return {"file_id": str(file_id), "id": id}


@entities.get("/download/{entity_id}/{file_id}")
async def download_image(entity_id: str, file_id: str, fs: GridFS = Depends(MongoDB.get_fs)):
    try:
        grid_out = fs.get(ObjectId(file_id))

        if grid_out.metadata.get("entity_id") != entity_id:
            raise HTTPException(
                status_code=404, detail="File not found for the given entity")

        return StreamingResponse(grid_out, media_type="image/png")
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")

@entities.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entity(id: str, current_user: User = Depends(oauth2.get_current_user), 
                        fs: GridFS = Depends(MongoDB.get_fs), db: Collection = Depends(MongoDB.get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=422, detail=f"The id {id} is not a valid ObjectId")
    
    entity: dict = db["entities"].find_one({"_id": ObjectId(id)})
    
    if not entity:
        raise HTTPException(
            status_code=404, detail=f"The entity with the id {id} can not be found or has been already deleted")
    

    if str(current_user.id) != entity.get("userId"):
        raise HTTPException(
            status_code=403, detail="You are not authorized to delete this entity")


    imgs: dict = entity.get("images")
    
    img_ids = [details["png"] for details in imgs.values()]

    
    if img_ids:
        for img_id in img_ids:
            fs.delete(ObjectId(img_id))
    
    db["entities"].delete_one({"_id": entity.get("_id")})
    
    return "Entity and associated images deleted successfully"