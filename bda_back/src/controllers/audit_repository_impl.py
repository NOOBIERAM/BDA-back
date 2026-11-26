from sqlalchemy.orm import Session

from models.entities import AuditFacture
from models.tables import AuditFactureTable
from repository.audit_repository import AuditRepository


class SQLAlchemyAuditRepository(AuditRepository):
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_all(self) -> list[AuditFacture]:
        rows = self.db.query(AuditFactureTable).order_by(AuditFactureTable.id.desc()).all()
        return [
            AuditFacture(
                id=row.id,
                type_action=row.type_action,
                date_modification=row.date_modification,
                numero_facture=row.numero_facture,
                nom_client=row.nom_client,
                date_facture=row.date_facture,
                montant_ancien=row.montant_ancien,
                montant_nouveau=row.montant_nouveau,
                utilisateur=row.utilisateur,
                machine_hote=row.machine_hote,
            )
            for row in rows
        ]
