# app/config.py
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://taxmate_user:taxmate_pass@localhost:5432/taxmate")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
JWT_ALGORITHM = "HS256"