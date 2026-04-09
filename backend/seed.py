"""
Run this once to populate the database with sample data.
Usage: python seed.py
"""
from database import SessionLocal, engine, Base
import models
from auth_utils import hash_password
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Admin user ────────────────────────────────────────────────────────────────
admin = models.User(
    email="admin@medigo.com",
    name="MediGo Admin",
    hashed_password=hash_password("admin123"),
    user_type=models.UserType.admin,
)
db.add(admin)

# ── Sample patient ────────────────────────────────────────────────────────────
patient = models.User(
    email="patient@medigo.com",
    name="Rahul Sharma",
    hashed_password=hash_password("patient123"),
    user_type=models.UserType.patient,
)
db.add(patient)
db.commit()

# ── Sample providers ──────────────────────────────────────────────────────────
providers_data = [
    {
        "name": "Dr. Priya Nair",
        "provider_type": models.ProviderType.doctor,
        "specialty": "Cardiologist",
        "location": "Chennai",
        "address": "12 Anna Salai, Chennai, Tamil Nadu",
        "phone": "+91-9876543210",
        "email": "priya.nair@medigo.com",
        "rating": 4.8,
        "is_verified": True,
        "emergency_services": False,
        "description": "Senior cardiologist with 15 years experience.",
    },
    {
        "name": "Dr. Arjun Mehta",
        "provider_type": models.ProviderType.doctor,
        "specialty": "Dermatologist",
        "location": "Chennai",
        "address": "45 T Nagar, Chennai, Tamil Nadu",
        "phone": "+91-9876543211",
        "email": "arjun.mehta@medigo.com",
        "rating": 4.5,
        "is_verified": True,
        "emergency_services": False,
        "description": "Specialist in skin and hair treatments.",
    },
    {
        "name": "Apollo Hospitals Chennai",
        "provider_type": models.ProviderType.hospital,
        "specialty": "Multi-specialty",
        "location": "Chennai",
        "address": "21 Greams Lane, Chennai, Tamil Nadu",
        "phone": "+91-44-28293333",
        "email": "info@apollochennai.com",
        "rating": 4.7,
        "is_verified": True,
        "emergency_services": True,
        "description": "Leading multi-specialty hospital with 24/7 emergency services.",
    },
    {
        "name": "SRL Diagnostics",
        "provider_type": models.ProviderType.lab,
        "specialty": "Pathology & Diagnostics",
        "location": "Chennai",
        "address": "8 Velachery Main Road, Chennai",
        "phone": "+91-44-22223333",
        "email": "srl.chennai@medigo.com",
        "rating": 4.3,
        "is_verified": True,
        "emergency_services": False,
        "description": "Full diagnostic services including blood tests and imaging.",
    },
    {
        "name": "Dr. Meena Krishnan",
        "provider_type": models.ProviderType.doctor,
        "specialty": "Pediatrician",
        "location": "Bangalore",
        "address": "77 MG Road, Bangalore, Karnataka",
        "phone": "+91-9876543212",
        "email": "meena.krishnan@medigo.com",
        "rating": 4.9,
        "is_verified": True,
        "emergency_services": False,
        "description": "Child specialist with focus on newborn care.",
    },
]

provider_objects = []
for p in providers_data:
    provider = models.Provider(**p)
    db.add(provider)
    provider_objects.append(provider)

db.commit()
for p in provider_objects:
    db.refresh(p)

# ── Sample time slots (next 7 days) ──────────────────────────────────────────
now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
slot_times = [9, 10, 11, 14, 15, 16]  # hours

for provider in provider_objects:
    for day_offset in range(1, 8):
        for hour in slot_times:
            start = now.replace(hour=hour) + timedelta(days=day_offset)
            end = start + timedelta(hours=1)
            slot = models.TimeSlot(
                provider_id=provider.id,
                start_time=start,
                end_time=end,
                is_available=True,
            )
            db.add(slot)

db.commit()
db.close()
print("✅ Seed data loaded successfully!")
print("   Admin:   admin@medigo.com / admin123")
print("   Patient: patient@medigo.com / patient123")
