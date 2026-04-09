def test_book_appointment(client, auth_headers):
    providers = client.get("/providers").json()
    assert len(providers) > 0
    pid = providers[0]["id"]
    slots = client.get(f"/providers/{pid}/slots").json()
    available = [s for s in slots if s["is_available"]]
    assert len(available) > 0
    res = client.post("/appointments", json={
        "slot_id": available[0]["id"],
        "notes": "Integration test booking"
    }, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["status"] == "confirmed"

def test_get_my_appointments(client, auth_headers):
    res = client.get("/appointments/me", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_book_without_auth(client):
    res = client.post("/appointments", json={"slot_id": 1, "notes": "no auth"})
    assert res.status_code == 401

def test_cancel_appointment(client, auth_headers):
    providers = client.get("/providers").json()
    pid = providers[0]["id"]
    slots = client.get(f"/providers/{pid}/slots").json()
    available = [s for s in slots if s["is_available"]]
    if len(available) > 0:
        book_res = client.post("/appointments", json={
            "slot_id": available[0]["id"],
            "notes": "to be cancelled"
        }, headers=auth_headers)
        appt_id = book_res.json()["id"]
        cancel_res = client.delete(f"/appointments/{appt_id}", headers=auth_headers)
        assert cancel_res.status_code == 200

def test_double_booking_same_slot(client, auth_headers):
    providers = client.get("/providers").json()
    pid = providers[0]["id"]
    slots = client.get(f"/providers/{pid}/slots").json()
    available = [s for s in slots if s["is_available"]]
    if len(available) > 0:
        slot_id = available[0]["id"]
        client.post("/appointments", json={"slot_id": slot_id, "notes": "first"}, headers=auth_headers)
        res = client.post("/appointments", json={"slot_id": slot_id, "notes": "second"}, headers=auth_headers)
        assert res.status_code in [400, 409]