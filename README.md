# MediGo – Healthcare Aggregation and Real-Time Booking Platform

## Tech Stack
- **Backend**: Python + FastAPI + SQLite
- **Frontend**: React (Vite)
- **Auth**: JWT (python-jose)
- **Testing**: pytest + httpx
- **Containerization**: Docker + Docker Compose

---

## Quick Start (Backend Only)

```bash
cd backend
pip install -r requirements.txt
python seed.py          # loads sample data
uvicorn main:app --reload
```

API runs at: http://localhost:8000  
Auto docs at: http://localhost:8000/docs  ← USE THIS FOR SCREENSHOTS

---

## Quick Start (Docker - Full Stack)

```bash
docker-compose up --build
```

---

## Default Credentials (after seed.py)

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@medigo.com       | admin123    |
| Patient | patient@medigo.com     | patient123  |

---

## API Endpoints

### Auth
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | /auth/register   | Register new user  |
| POST   | /auth/login      | Login, get token   |

### Providers
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| GET    | /providers                    | Search/list providers    |
| GET    | /providers?q=cardio           | Filter by specialty      |
| GET    | /providers?location=Chennai   | Filter by location       |
| GET    | /providers/{id}               | Get provider details     |
| GET    | /providers/{id}/slots         | Get available time slots |
| POST   | /providers                    | Create provider (admin)  |

### Appointments
| Method | Endpoint                         | Description            |
|--------|----------------------------------|------------------------|
| POST   | /appointments                    | Book appointment       |
| GET    | /appointments                    | My appointments        |
| GET    | /appointments/{id}               | Appointment details    |
| PATCH  | /appointments/{id}/cancel        | Cancel appointment     |

---

## Running Tests

```bash
cd backend
pytest tests/ -v
```

---

## Project Structure

```
medigo/
├── backend/
│   ├── main.py           # FastAPI app entry
│   ├── database.py       # SQLite connection
│   ├── models.py         # DB models (User, Provider, TimeSlot, Appointment)
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── auth_utils.py     # JWT + password hashing
│   ├── seed.py           # Sample data loader
│   ├── routers/
│   │   ├── auth.py       # Register/Login
│   │   ├── providers.py  # Search, filter, slots
│   │   └── appointments.py # Book, view, cancel
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_*.py
│   └── requirements.txt
├── frontend/             # React app (next step)
├── docker-compose.yml
└── README.md
```
