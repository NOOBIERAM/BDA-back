from models.entities import AuditFacture
from repository.audit_repository import AuditRepository


class ListAuditUseCase:
    def __init__(self, audit_repository: AuditRepository) -> None:
        self.audit_repository = audit_repository

    def execute(self) -> list[AuditFacture]:
        return self.audit_repository.list_all()
