from app.db import Base

import uuid 
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy import Column, String, Integer, Boolean, Float, ForeignKey, LargeBinary


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    google_account = Column(Boolean, nullable=False, server_default=text("false"))

class BannedTokens(Base):
    __tablename__ = "bannedtokens"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    token = Column(String, nullable=False)
    banned_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

class Advert(Base):
    __tablename__ = "adverts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    plz = Column(String, nullable=False)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    offer = Column(String, nullable=False)
    attributes = Column(ARRAY(String), nullable=False)
    description = Column(String, nullable=True)

    user= relationship("User", backref="adverts", lazy="joined")

class Entity(Base):
    __tablename__ = "entities"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    country = Column(String, nullable=False)
    city = Column(String, nullable=False)
    plz = Column(String, nullable=False)
    street = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  
    offer = Column(String, nullable=False)
    attributes = Column(ARRAY(String), nullable=False)
    description = Column(String, nullable=True)
    
    images = relationship("Image", backref="entity", cascade="all, delete-orphan", lazy="joined")
    user = relationship("User", backref="entities", lazy="joined")

class Image(Base):
    __tablename__ = "images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    entity_id = Column(UUID(as_uuid=True), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    filename = Column(String, nullable=False)
    content = Column(LargeBinary, nullable=False)

