from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/trainers", response_model=List[schemas.TrainerListItem])
def search_trainers(
    city_id: Optional[int] = None,
    sport_type_id: Optional[int] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_rating: Optional[float] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.search_trainers(
        db=db,
        city_id=city_id,
        sport_type_id=sport_type_id,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        skip=skip,
        limit=limit
    )

@router.get("/cities", response_model=List[schemas.CityResponse])
def get_cities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_cities(db, skip=skip, limit=limit)

@router.get("/sport-types", response_model=List[schemas.SportTypeResponse])
def get_sport_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sport_types(db, skip=skip, limit=limit)
