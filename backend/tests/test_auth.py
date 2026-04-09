def test_register_new_user(client):
    res = client.post("/auth/register", json={
        "email": "newuser@medigo.com",
        "password": "password123",
        "full_name": "New User",
        "user_type": "patient"
    })
    assert res.status_code == 200
    assert res.json()["user"]["email"] == "newuser@medigo.com"
    print(res.json())


def test_register_duplicate_email(client):
    client.post("/auth/register", json={
        "email": "duplicate@medigo.com",
        "password": "password123",
        "full_name": "Dup User",
        "user_type": "patient"
    })

    res = client.post("/auth/register", json={
        "email": "duplicate@medigo.com",
        "password": "password123",
        "full_name": "Dup User",
        "user_type": "patient"
    })

    # backend might return 400 OR 409 → allow both
    assert res.status_code in [400, 409]
def test_login_valid(client):
    client.post("/auth/register", json={
        "email": "logintest@medigo.com",
        "password": "mypassword",
        "full_name": "Login Test",
        "user_type": "patient"
    })

    res = client.post("/auth/login", json={
        "username": "logintest@medigo.com",
        "password": "mypassword"
    })

    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password(client):
    res = client.post("/auth/login", json={
        "username": "logintest@medigo.com",
        "password": "wrongpassword"
    })

    assert res.status_code == 401


def test_login_nonexistent_user(client):
    res = client.post("/auth/login", json={
        "username": "ghost@medigo.com",
        "password": "whatever"
    })

    assert res.status_code == 401