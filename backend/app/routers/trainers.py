from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/trainers", tags=["trainers"])

@router.get("/", response_model=List[schemas.TrainerListItem])
def read_trainers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_trainers(db, skip=skip, limit=limit)

@router.get("/{trainer_id}", response_model=schemas.TrainerResponse)
def read_trainer(trainer_id: int, db: Session = Depends(get_db)):
    trainer = crud.get_trainer(db, trainer_id=trainer_id)
    if trainer is None:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return trainer

@router.post("/", response_model=schemas.TrainerResponse)
def create_trainer(trainer: schemas.TrainerCreate, db: Session = Depends(get_db)):
    return crud.create_trainer(db=db, trainer=trainer)

@router.post("/{trainer_id}/reviews", response_model=schemas.ReviewResponse)
def create_review(trainer_id: int, review: schemas.ReviewBase, db: Session = Depends(get_db)):
    trainer = crud.get_trainer(db, trainer_id=trainer_id)
    if trainer is None:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return crud.create_review(db=db, trainer_id=trainer_id, review=review)
