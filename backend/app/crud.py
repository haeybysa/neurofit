from sqlalchemy.orm import Session
from . import models, schemas

def get_cities(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.City).offset(skip).limit(limit).all()

def get_city(db: Session, city_id: int):
    return db.query(models.City).filter(models.City.id == city_id).first()

def get_sport_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SportType).offset(skip).limit(limit).all()

def get_sport_type(db: Session, sport_type_id: int):
    return db.query(models.SportType).filter(models.SportType.id == sport_type_id).first()

def get_trainers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Trainer).filter(models.Trainer.is_active == True).offset(skip).limit(limit).all()

def get_trainer(db: Session, trainer_id: int):
    return db.query(models.Trainer).filter(models.Trainer.id == trainer_id).first()

def search_trainers(
    db: Session,
    city_id: int = None,
    sport_type_id: int = None,
    min_price: int = None,
    max_price: int = None,
    min_rating: float = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(models.Trainer).filter(models.Trainer.is_active == True)

    if city_id:
        query = query.filter(models.Trainer.city_id == city_id)
    if sport_type_id:
        query = query.filter(models.Trainer.sport_type_id == sport_type_id)
    if min_price is not None:
        query = query.filter(models.Trainer.price_per_hour >= min_price)
    if max_price is not None:
        query = query.filter(models.Trainer.price_per_hour <= max_price)
    if min_rating is not None:
        query = query.filter(models.Trainer.rating >= min_rating)

    return query.order_by(models.Trainer.rating.desc()).offset(skip).limit(limit).all()

def create_trainer(db: Session, trainer: schemas.TrainerCreate):
    db_trainer = models.Trainer(**trainer.dict())
    db.add(db_trainer)
    db.commit()
    db.refresh(db_trainer)
    return db_trainer

def create_review(db: Session, trainer_id: int, review: schemas.ReviewBase):
    db_review = models.Review(trainer_id=trainer_id, **review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    trainer = db.query(models.Trainer).filter(models.Trainer.id == trainer_id).first()
    reviews = db.query(models.Review).filter(models.Review.trainer_id == trainer_id).all()
    avg_rating = sum(r.rating for r in reviews) / len(reviews)
    trainer.rating = round(avg_rating, 1)
    trainer.reviews_count = len(reviews)
    db.commit()

    return db_review

def create_booking(db: Session, booking: schemas.BookingCreate):
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Booking).order_by(models.Booking.created_at.desc()).offset(skip).limit(limit).all()
