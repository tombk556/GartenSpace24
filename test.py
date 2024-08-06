from pydantic import BaseModel, Field, field_validator
from bson import ObjectId


        
class User(BaseModel):
    id: str = Field(alias="_id")
    name: str
    age: int = Field(gt=17, lt=100)
    
    @field_validator("id", mode="before")
    def validate_object_id(cls, value):
        try:
            obj_id = ObjectId(value)
            return str(obj_id)
        except Exception as e:
            raise ValueError(f"Invalid ObjectId: {value}") from e
        
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


data: dict = {
    "_id": "66ac91e3f59c97b8c1ca1463",
    "name": "Tom",
    "age": 25
}
entity = User(**data)
print(entity)
print(entity.model_dump_json())
