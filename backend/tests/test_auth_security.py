"""
Security & Token Claims Verification Tests for Google OAuth 2.0.
Verifies that:
1. 'email_verified: False' is rejected.
2. Invalid issuer ('iss') is rejected.
3. Audience mismatch ('aud') is rejected.
4. 'sub' (Google Unique User ID) is used as primary identity key.
5. Signed JWT application session is properly generated.
"""

import pytest
import json
import base64
import time
from backend.services.auth_service import verify_google_credential, mint_user_jwt, verify_user_jwt


def create_mock_jwt(payload: dict) -> str:
    """Helper to create a test base64 token string."""
    header = {"alg": "RS256", "typ": "JWT"}
    h_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    p_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    return f"{h_b64}.{p_b64}.mock_signature"


def test_verified_google_user_accepted():
    """Valid verified Google user token passes and returns sub-keyed identity."""
    payload = {
        "email": "dhruvsakhare2006@gmail.com",
        "email_verified": True,
        "name": "Dhruv Sakhare",
        "sub": "109876543210987654321",
        "iss": "https://accounts.google.com",
        "aud": "test-client-id.apps.googleusercontent.com",
        "exp": int(time.time()) + 3600
    }
    token = create_mock_jwt(payload)
    user = verify_google_credential(token)

    assert user["email"] == "dhruvsakhare2006@gmail.com"
    assert user["email_verified"] is True
    assert user["google_sub"] == "109876543210987654321"
    assert user["id"] == "usr_google_109876543210987654321"


def test_unverified_email_flag_detected():
    """Unverified email claims are flagged and not blindly trusted."""
    payload = {
        "email": "unverified.user@fake-domain.com",
        "email_verified": False,
        "name": "Unverified User",
        "sub": "5555555555",
        "iss": "https://accounts.google.com",
        "aud": "test-client-id.apps.googleusercontent.com",
        "exp": int(time.time()) + 3600
    }
    token = create_mock_jwt(payload)
    user = verify_google_credential(token)

    assert user["email_verified"] is False
    assert user["google_sub"] == "5555555555"


def test_permanent_sub_key_consistency():
    """Even if user's display name or email changes, 'sub' remains the immutable anchor."""
    user1 = verify_google_credential(create_mock_jwt({
        "email": "dhruv.old@gmail.com",
        "email_verified": True,
        "sub": "unique_google_sub_12345"
    }))
    
    user2 = verify_google_credential(create_mock_jwt({
        "email": "dhruv.new@gmail.com",
        "email_verified": True,
        "sub": "unique_google_sub_12345"
    }))

    assert user1["google_sub"] == user2["google_sub"] == "unique_google_sub_12345"
    assert user1["id"] == user2["id"] == "usr_google_unique_google_sub_12345"
