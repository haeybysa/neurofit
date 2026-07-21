from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=schemas.BookingResponse)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    trainer = crud.get_trainer(db, trainer_id=booking.trainer_id)
    if trainer is None:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return crud.create_booking(db=db, booking=booking)

@router.get("/", response_model=List[schemas.BookingResponse])
def read_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_bookings(db, skip=skip, limit=limit)
