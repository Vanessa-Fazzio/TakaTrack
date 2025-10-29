import os

class Config:
    """Configuration settings for the Flask app."""

    DEBUG = True
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///waste_management.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")

    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))  # 1 hour

    JWT_TOKEN_LOCATION = ["headers"]

    JWT_DECODE_ISSUER = os.getenv("JWT_DECODE_ISSUER", "TakaTrack-Auth")
    JWT_ENCODE_ISSUER = os.getenv("JWT_ENCODE_ISSUER", "TakaTrack-Auth")
