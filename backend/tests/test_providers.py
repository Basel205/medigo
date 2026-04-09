def test_get_all_providers(client):
    res = client.get("/providers")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_search_providers_by_name(client):
    res = client.get("/providers", params={"search": "doctor"})
    assert res.status_code == 200

def test_filter_by_type(client):
    res = client.get("/providers", params={"provider_type": "doctor"})
    assert res.status_code == 200
    for p in res.json():
        assert p["provider_type"] == "doctor"

def test_filter_by_location(client):
    res = client.get("/providers", params={"location": "Chennai"})
    assert res.status_code == 200

def test_get_provider_by_id(client):
    all_providers = client.get("/providers").json()
    if len(all_providers) > 0:
        pid = all_providers[0]["id"]
        res = client.get(f"/providers/{pid}")
        assert res.status_code == 200
        assert res.json()["id"] == pid

def test_get_invalid_provider(client):
    res = client.get("/providers/99999")
    assert res.status_code == 404

def test_get_slots_for_provider(client):
    all_providers = client.get("/providers").json()
    if len(all_providers) > 0:
        pid = all_providers[0]["id"]
        res = client.get(f"/providers/{pid}/slots")
        assert res.status_code == 200
        assert isinstance(res.json(), list)