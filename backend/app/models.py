from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    emoji = Column(String(10))

    trainers = relationship("Trainer", back_populates="city")

class SportType(Base):
    __tablename__ = "sport_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    emoji = Column(String(10))

    trainers = relationship("Trainer", back_populates="sport_type")

class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    photo_url = Column(String(500))
    bio = Column(Text)
    experience_years = Column(Integer)
    price_per_hour = Column(Integer, nullable=False)
    rating = Column(Float, default=5.0)
    reviews_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    phone = Column(String(20))
    telegram = Column(String(100))
    city_id = Column(Integer, ForeignKey("cities.id"))
    sport_type_id = Column(Integer, ForeignKey("sport_types.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    city = relationship("City", back_populates="trainers")
    sport_type = relationship("SportType", back_populates="trainers")
    reviews = relationship("Review", back_populates="trainer")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    author_name = Column(String(100))
    rating = Column(Float)
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainer = relationship("Trainer", back_populates="reviews")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    client_name = Column(String(100), nullable=False)
    client_phone = Column(String(20), nullable=False)
    client_email = Column(String(100))
    message = Column(Text)
    status = Column(String(20), default="new")
    created_at = Column(DateTime, default=datetime.utcnow)
