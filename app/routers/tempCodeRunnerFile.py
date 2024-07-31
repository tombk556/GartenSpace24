@router.get("/get_entities")
def get_entities(db: Collection = Depends(get_db)):
    entities = db["entities"].find({"address": {"$exists": True}})
    data = [entity for entity in entities]
    return data