from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth_utils import get_current_user

router = APIRouter()


@router.post("/", response_model=schemas.AppointmentOut)
def book_appointment(
    data: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Look up the slot by slot_id
    slot = db.query(models.TimeSlot).filter(
        models.TimeSlot.id == data.slot_id,
        models.TimeSlot.is_available == True,
    ).first()

    if not slot:
        raise HTTPException(status_code=400, detail="Time slot is not available")

    provider = db.query(models.Provider).filter(models.Provider.id == slot.provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    # Create appointment
    appointment = models.Appointment(
        patient_id=current_user.id,
        provider_id=slot.provider_id,
        time_slot_id=slot.id,
        notes=data.notes,
        status=models.AppointmentStatus.confirmed,
    )
    db.add(appointment)

    # Mark slot as unavailable
    slot.is_available = False
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("/me", response_model=List[schemas.AppointmentOut])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Appointment).filter(
        models.Appointment.patient_id == current_user.id
    ).order_by(models.Appointment.created_at.desc()).all()


@router.get("/", response_model=List[schemas.AppointmentOut])
def get_all_my_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Appointment).filter(
        models.Appointment.patient_id == current_user.id
    ).order_by(models.Appointment.created_at.desc()).all()


@router.get("/{appointment_id}", response_model=schemas.AppointmentOut)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id,
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.delete("/{appointment_id}", response_model=schemas.AppointmentOut)
def cancel_appointment_delete(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Cancel an appointment via DELETE method (used by tests)."""
    return _do_cancel(appointment_id, db, current_user)


@router.patch("/{appointment_id}/cancel", response_model=schemas.AppointmentOut)
def cancel_appointment_patch(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Cancel an appointment via PATCH method (REST alternative)."""
    return _do_cancel(appointment_id, db, current_user)


def _do_cancel(appointment_id: int, db: Session, current_user: models.User):
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id,
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.status == models.AppointmentStatus.cancelled:
        raise HTTPException(status_code=400, detail="Appointment already cancelled")

    # Free up the slot
    slot = db.query(models.TimeSlot).filter(
        models.TimeSlot.id == appointment.time_slot_id
    ).first()
    if slot:
        slot.is_available = True

    appointment.status = models.AppointmentStatus.cancelled
    db.commit()
    db.refresh(appointment)
    return appointment
