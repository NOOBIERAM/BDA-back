from abc import ABC, abstractmethod

from models.entities import AuditFacture


class AuditRepository(ABC):
    @abstractmethod
    def list_all(self) -> list[AuditFacture]:
        raise NotImplementedError
