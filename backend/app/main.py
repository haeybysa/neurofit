from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import trainers, search, bookings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NeuroFit API",
    description="API for NeuroFit - sports trainer marketplace",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trainers.router)
app.include_router(search.router)
app.include_router(bookings.router)

@app.get("/")
def root():
    return {
        "message": "NeuroFit API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
