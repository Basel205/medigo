import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
import models
from datetime import datetime, timedelta

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_medigo.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # Seed providers and time slots for appointment tests
    db = TestingSessionLocal()
    try:
        providers_data = [
            {
                "name": "Dr. Test Doctor",
                "provider_type": models.ProviderType.doctor,
                "specialty": "Cardiologist",
                "location": "Chennai",
                "address": "12 Test Street",
                "phone": "+91-9999999999",
                "email": "testdoctor@medigo.com",
                "rating": 4.5,
                "is_verified": True,
                "emergency_services": False,
                "description": "Test doctor for integration tests",
            }
        ]
        provider_objects = []
        for p in providers_data:
            provider = models.Provider(**p)
            db.add(provider)
            provider_objects.append(provider)
        db.commit()
        for p in provider_objects:
            db.refresh(p)

        # Add time slots for next 7 days
        now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
        for provider in provider_objects:
            for day_offset in range(1, 8):
                for hour in [9, 10, 11, 14, 15]:
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
    finally:
        db.close()

    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client():
    return TestClient(app)

@pytest.fixture(scope="module")
def auth_headers(client):
    client.post("/auth/register", json={
        "email": "testuser@medigo.com",
        "password": "testpass123",
        "full_name": "Test User",
        "user_type": "patient"
    })

    res = client.post("/auth/login", json={
        "username": "testuser@medigo.com",
        "password": "testpass123"
    })

    assert res.status_code == 200, res.json()

    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}