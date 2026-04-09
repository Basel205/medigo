from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserType, AppointmentStatus, ProviderType


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    user_type: UserType = UserType.patient

class UserLogin(BaseModel):
    username: EmailStr  # alias for email, used as tests
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    name: str
    user_type: UserType
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── Providers ─────────────────────────────────────────────────────────────────

class ProviderOut(BaseModel):
    id: int
    name: str
    provider_type: ProviderType
    specialty: Optional[str]
    location: str
    address: str
    phone: str
    email: Optional[str]
    rating: float
    is_verified: bool
    emergency_services: bool
    description: Optional[str]

    class Config:
        from_attributes = True

class ProviderCreate(BaseModel):
    name: str
    provider_type: ProviderType
    specialty: Optional[str] = None
    location: str
    address: str
    phone: str
    email: Optional[str] = None
    emergency_services: bool = False
    description: Optional[str] = None


# ── Time Slots ────────────────────────────────────────────────────────────────

class TimeSlotOut(BaseModel):
    id: int
    provider_id: int
    start_time: datetime
    end_time: datetime
    is_available: bool

    class Config:
        from_attributes = True


# ── Appointments ──────────────────────────────────────────────────────────────

class AppointmentCreate(BaseModel):
    slot_id: int  # maps to time_slot.id
    notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    patient_id: int
    provider_id: int
    time_slot_id: int
    status: AppointmentStatus
    notes: Optional[str]
    created_at: datetime
    provider: ProviderOut
    time_slot: TimeSlotOut

    class Config:
        from_attributes = True

class AppointmentUpdate(BaseModel):
    status: AppointmentStatus
