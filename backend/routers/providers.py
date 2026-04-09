from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas
from auth_utils import get_current_user

router = APIRouter()


@router.get("/", response_model=List[schemas.ProviderOut])
def search_providers(
    q: Optional[str] = Query(None, description="Search by name or specialty"),
    search: Optional[str] = Query(None, description="Alias for q"),
    location: Optional[str] = Query(None),
    provider_type: Optional[models.ProviderType] = Query(None),
    emergency_only: bool = Query(False),
    db: Session = Depends(get_db),
):
    query = db.query(models.Provider).filter(models.Provider.is_verified == True)

    search_term = q or search
    if search_term:
        query = query.filter(
            (models.Provider.name.ilike(f"%{search_term}%")) |
            (models.Provider.specialty.ilike(f"%{search_term}%"))
        )
    if location:
        query = query.filter(models.Provider.location.ilike(f"%{location}%"))
    if provider_type:
        query = query.filter(models.Provider.provider_type == provider_type)
    if emergency_only:
        query = query.filter(models.Provider.emergency_services == True)

    return query.order_by(models.Provider.rating.desc()).all()


@router.get("/{provider_id}", response_model=schemas.ProviderOut)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = db.query(models.Provider).filter(models.Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider


@router.get("/{provider_id}/slots", response_model=List[schemas.TimeSlotOut])
def get_available_slots(provider_id: int, db: Session = Depends(get_db)):
    provider = db.query(models.Provider).filter(models.Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    from datetime import datetime
    slots = db.query(models.TimeSlot).filter(
        models.TimeSlot.provider_id == provider_id,
        models.TimeSlot.is_available == True,
        models.TimeSlot.start_time >= datetime.utcnow()
    ).order_by(models.TimeSlot.start_time).all()

    return slots


@router.post("/", response_model=schemas.ProviderOut, status_code=201)
def create_provider(
    data: schemas.ProviderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.user_type != models.UserType.admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    provider = models.Provider(**data.dict(), is_verified=True)
    db.add(provider)
    db.commit()
    db.refresh(provider)
    return provider
