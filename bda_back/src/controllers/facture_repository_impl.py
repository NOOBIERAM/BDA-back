from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from models.entities import Facture
from models.tables import FactureTable
from repository.facture_repository import FactureRepository


class SQLAlchemyFactureRepository(FactureRepository):
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, numero_facture: str, nom_client: str, date_facture: date, montant: Decimal) -> Facture:
        row = FactureTable(
            numero_facture=numero_facture,
            nom_client=nom_client,
            date_facture=date_facture,
            montant=montant,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return Facture(
            id=row.id,
            numero_facture=row.numero_facture,
            nom_client=row.nom_client,
            date_facture=row.date_facture,
            montant=row.montant,
        )

    def update(self, facture_id: int, numero_facture: str, nom_client: str, date_facture: date, montant: Decimal) -> Facture | None:
        row = self.db.query(FactureTable).filter(FactureTable.id == facture_id).first()
        if row is None:
            return None

        row.numero_facture = numero_facture
        row.nom_client = nom_client
        row.date_facture = date_facture
        row.montant = montant

        self.db.commit()
        self.db.refresh(row)

        return Facture(
            id=row.id,
            numero_facture=row.numero_facture,
            nom_client=row.nom_client,
            date_facture=row.date_facture,
            montant=row.montant,
        )

    def delete(self, facture_id: int) -> bool:
        row = self.db.query(FactureTable).filter(FactureTable.id == facture_id).first()
        if row is None:
            return False
        self.db.delete(row)
        self.db.commit()
        return True

    def list_all(self) -> list[Facture]:
        rows = self.db.query(FactureTable).order_by(FactureTable.id.desc()).all()
        return [
            Facture(
                id=row.id,
                numero_facture=row.numero_facture,
                nom_client=row.nom_client,
                date_facture=row.date_facture,
                montant=row.montant,
            )
            for row in rows
        ]
