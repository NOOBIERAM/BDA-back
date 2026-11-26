from sqlalchemy.orm import declarative_base


Base = declarative_base()

# Import models for Alembic autogenerate metadata discovery.
# from models.tables import AuditFactureTable, FactureTable, UtilisateurTable  # noqa: E402,F401

from .tables import AuditFactureTable, FactureTable, UtilisateurTable  # noqa: E402,F401

__all__ = ["Base", "UtilisateurTable", "FactureTable", "AuditFactureTable"]
