from datetime import datetime, date

from sqlalchemy import Date, DateTime, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

# from models import Base
from . import Base


class UtilisateurTable(Base):
    __tablename__ = "utilisateur"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class FactureTable(Base):
    __tablename__ = "facture"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    numero_facture: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    nom_client: Mapped[str] = mapped_column(String(255), nullable=False)
    date_facture: Mapped[date] = mapped_column(Date, nullable=False)
    montant: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)


class AuditFactureTable(Base):
    __tablename__ = "audit_facture"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    type_action: Mapped[str] = mapped_column(String(10), nullable=False)
    date_modification: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    numero_facture: Mapped[str] = mapped_column(String(100), nullable=False)
    nom_client: Mapped[str] = mapped_column(String(255), nullable=False)
    date_facture: Mapped[date] = mapped_column(Date, nullable=False)
    montant_ancien: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    montant_nouveau: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    utilisateur: Mapped[str | None] = mapped_column(String(100), nullable=True)
    machine_hote: Mapped[str | None] = mapped_column(String(255), nullable=True)
