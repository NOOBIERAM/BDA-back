import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


load_dotenv(dotenv_path=".env")

DB_DATABASE = os.getenv("DB_DATABASE", "bda")
DB_USERNAME = os.getenv("DB_USERNAME", "bda")
DB_PASSWORD = os.getenv("DB_PASSWORD", "bda")
DB_HOST = os.getenv("DB_HOST", "bda-db")
DB_PORT = os.getenv("DB_PORT", "5432")

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+psycopg2://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}",
)

# SQLAlchemy 2.1 defaults plain "postgresql://" URLs to the psycopg (v3) driver.
# This project installs psycopg2, so make the driver explicit.
if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
        "postgresql://", "postgresql+psycopg2://", 1
    )

engine = create_engine(SQLALCHEMY_DATABASE_URL, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
