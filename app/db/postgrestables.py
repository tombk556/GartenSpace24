from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID  
import uuid 
from .postgres import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    google_account = Column(Boolean, nullable=False, server_default=text("false"))

class BannedTokens(Base):
    __tablename__ = "bannedtokens"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    token = Column(String, nullable=False)
    banned_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    