"""
Mutation tests — verify that if we break core logic, tests catch it.
These test the DETECTION of mutations, not the mutations themselves.
"""
from auth_utils import hash_password, verify_password
from jose import jwt
from auth_utils import SECRET_KEY, ALGORITHM

def test_password_hash_is_not_plaintext():
    hashed = hash_password("mypassword")
    assert hashed != "mypassword"

def test_correct_password_verifies():
    hashed = hash_password("correcthorse")
    assert verify_password("correcthorse", hashed) is True

def test_wrong_password_fails():
    hashed = hash_password("correcthorse")
    assert verify_password("wrongpassword", hashed) is False

def test_empty_password_fails():
    hashed = hash_password("realpassword")
    assert verify_password("", hashed) is False

def test_jwt_contains_correct_subject():
    from auth_utils import create_access_token
    token = create_access_token({"sub": "user@test.com"})
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert payload["sub"] == "user@test.com"

def test_jwt_wrong_secret_fails():
    from auth_utils import create_access_token
    from jose import JWTError
    token = create_access_token({"sub": "user@test.com"})
    try:
        jwt.decode(token, "wrongsecret", algorithms=[ALGORITHM])
        assert False, "Should have raised JWTError"
    except JWTError:
        assert True

def test_tampered_token_fails():
    from auth_utils import create_access_token
    from jose import JWTError
    token = create_access_token({"sub": "user@test.com"})
    tampered = token[:-5] + "XXXXX"
    try:
        jwt.decode(tampered, SECRET_KEY, algorithms=[ALGORITHM])
        assert False, "Should have raised JWTError"
    except JWTError:
        assert True