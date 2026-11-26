from datetime import date
from decimal import Decimal

from models.entities import Facture
from repository.facture_repository import FactureRepository
from services.exceptions import NotFoundError


class CreateFactureUseCase:
    def __init__(self, facture_repository: FactureRepository) -> None:
        self.facture_repository = facture_repository

    def execute(self, numero_facture: str, nom_client: str, date_facture: date, montant: Decimal) -> Facture:
        return self.facture_repository.create(numero_facture, nom_client, date_facture, montant)


class UpdateFactureUseCase:
    def __init__(self, facture_repository: FactureRepository) -> None:
        self.facture_repository = facture_repository

    def execute(self, facture_id: int, numero_facture: str, nom_client: str, date_facture: date, montant: Decimal) -> Facture:
        facture = self.facture_repository.update(facture_id, numero_facture, nom_client, date_facture, montant)
        if facture is None:
            raise NotFoundError("Facture not found")
        return facture


class DeleteFactureUseCase:
    def __init__(self, facture_repository: FactureRepository) -> None:
        self.facture_repository = facture_repository

    def execute(self, facture_id: int) -> None:
        deleted = self.facture_repository.delete(facture_id)
        if not deleted:
            raise NotFoundError("Facture not found")


class ListFactureUseCase:
    def __init__(self, facture_repository: FactureRepository) -> None:
        self.facture_repository = facture_repository

    def execute(self) -> list[Facture]:
        return self.facture_repository.list_all()
