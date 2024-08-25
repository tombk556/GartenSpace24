from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from ..db.mongodb import get_db, get_fs
from ..models.usermodels import User
from ..models.entitymodels import Entity, EntityResponse
from pymongo.collection import Collection
from bson import ObjectId
from gridfs import GridFS
from .. import oauth2

router = APIRouter(
    prefix="/entities",
    tags=["Entities"])


@router.post("/create_entity", status_code=status.HTTP_201_CREATED)
def create_entity(entity: Entity, current_user: User = Depends(oauth2.get_current_user), db: Collection = Depends(get_db)):
    entity.userId = str(current_user.id)
    db["entities"].insert_one(entity.model_dump())
    return entity


@router.get("/get_all_entities", response_model=list[EntityResponse])
def get_all_entities(db: Collection = Depends(get_db)):
    entities = db["entities"].find({"address": {"$exists": True}})

    return entities

@router.get("/get_entity/{id}", response_model=Entity)
def get_entity(id: str, db: Collection = Depends(get_db)):
    entity = db["entities"].find_one({'_id': ObjectId(id)})
    if entity:
        entity['_id'] = str(entity['_id'])
    return entity


@router.post("/upload/")
async def upload_image(file: UploadFile = File(...), fs: GridFS = Depends(get_fs)):
    file_content = await file.read()
    file_id = fs.put(file_content, filename=file.filename)
    return {"file_id": str(file_id)}


@router.get("/download/{file_id}")
async def download_image(file_id: str, fs: GridFS = Depends(get_fs)):
    try:
        grid_out = fs.get(ObjectId(file_id))
        return StreamingResponse(grid_out, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")