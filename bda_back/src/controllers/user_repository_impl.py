from sqlalchemy.orm import Session

from models.entities import Utilisateur
from models.tables import UtilisateurTable
from repository.user_repository import UserRepository


class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, username: str, password_hash: str) -> Utilisateur:
        row = UtilisateurTable(username=username, password_hash=password_hash)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return Utilisateur(
            id=row.id,
            username=row.username,
            password_hash=row.password_hash,
            created_at=row.created_at,
        )

    def get_by_username(self, username: str) -> Utilisateur | None:
        row = self.db.query(UtilisateurTable).filter(UtilisateurTable.username == username).first()
        if row is None:
            return None
        return Utilisateur(
            id=row.id,
            username=row.username,
            password_hash=row.password_hash,
            created_at=row.created_at,
        )
