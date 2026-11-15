import hashlib
import os
import hmac
import base64
import json
import time
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from app.config import settings

def hash_password(password: str) -> str:
    """Securely hash a password using PBKDF2-HMAC-SHA256 with a random 16-byte salt."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    return f"{base64.b64encode(salt).decode('utf-8')}${base64.b64encode(key).decode('utf-8')}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that a plaintext password matches the stored PBKDF2 hash."""
    try:
        salt_b64, key_b64 = hashed_password.split('$')
        salt = base64.b64decode(salt_b64.encode('utf-8'))
        stored_key = base64.b64decode(key_b64.encode('utf-8'))
        computed_key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt,
            100000
        )
        return hmac.compare_digest(stored_key, computed_key)
    except Exception:
        return False

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4)) if len(data) % 4 != 0 else ''
    return base64.urlsafe_b64decode((data + padding).encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a standard cryptographic HMAC-SHA256 JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": int(expire.timestamp())})
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_bytes = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_bytes = json.dumps(to_encode, separators=(',', ':')).encode('utf-8')
    
    header_b64 = base64url_encode(header_bytes)
    payload_b64 = base64url_encode(payload_bytes)
    
    signature = hmac.new(
        settings.SECRET_KEY.encode('utf-8'),
        f"{header_b64}.{payload_b64}".encode('utf-8'),
        hashlib.sha256
    ).digest()
    
    sig_b64 = base64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and cryptographically verify a JWT access token."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode('utf-8'),
            f"{header_b64}.{payload_b64}".encode('utf-8'),
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(base64url_decode(sig_b64), expected_sig):
            return None
            
        payload = json.loads(base64url_decode(payload_b64).decode('utf-8'))
        if "exp" in payload and time.time() > payload["exp"]:
            return None  # Token expired
            
        return payload
    except Exception:
        return None
