from abc import ABC, abstractmethod
from datetime import date
from decimal import Decimal

from models.entities import Facture


class FactureRepository(ABC):
    @abstractmethod
    def create(self, numero_facture: str, nom_client: str, date_facture: date, montant: Decimal) -> Facture:
        raise NotImplementedError

    @abstractmethod
    def update(self, facture_id: int, numero_facture: str, nom_client: str, date_facture: date, montant: Decimal) -> Facture | None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, facture_id: int) -> bool:
        raise NotImplementedError

    @abstractmethod
    def list_all(self) -> list[Facture]:
        raise NotImplementedError
