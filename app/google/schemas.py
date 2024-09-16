import random
import string
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, computed_field

def random_password(n: int = 30) -> str:
    return ''.join(random.choice(string.digits + string.ascii_letters) for _ in range(n))


class GoogleUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100, default=random_password())
    name: Optional[str] = Field(pattern=r"^[a-zA-Z0-9-' ]+$", default="gmail_user")
    age: Optional[int] = Field(gt=17, lt=100, default=99)
    google_account: bool = Field(default=True)
    
    @computed_field
    @property
    def username(self) -> str:
        return self.email.split('@')[0]
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None



