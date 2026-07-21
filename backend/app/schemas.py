from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CityBase(BaseModel):
    name: str
    emoji: Optional[str] = None

class CityResponse(CityBase):
    id: int
    class Config:
        from_attributes = True

class SportTypeBase(BaseModel):
    name: str
    emoji: Optional[str] = None

class SportTypeResponse(SportTypeBase):
    id: int
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    author_name: str
    rating: float
    text: str

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class TrainerBase(BaseModel):
    first_name: str
    last_name: str
    photo_url: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    price_per_hour: int
    rating: float = 5.0
    reviews_count: int = 0
    is_verified: bool = False
    phone: Optional[str] = None
    telegram: Optional[str] = None
    is_active: bool = True

class TrainerCreate(TrainerBase):
    city_id: int
    sport_type_id: int

class TrainerResponse(TrainerBase):
    id: int
    city: CityResponse
    sport_type: SportTypeResponse
    reviews: List[ReviewResponse] = []
    created_at: datetime
    class Config:
        from_attributes = True

class TrainerListItem(BaseModel):
    id: int
    first_name: str
    last_name: str
    photo_url: Optional[str] = None
    experience_years: Optional[int] = None
    price_per_hour: int
    rating: float
    reviews_count: int
    is_verified: bool
    city: CityResponse
    sport_type: SportTypeResponse
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    trainer_id: int
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    message: Optional[str] = None

class BookingResponse(BookingCreate):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class SearchFilters(BaseModel):
    city_id: Optional[int] = None
    sport_type_id: Optional[int] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    min_rating: Optional[float] = None
