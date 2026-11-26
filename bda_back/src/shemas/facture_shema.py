from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class FactureCreateRequest(BaseModel):
    numero_facture: str = Field(min_length=1, max_length=100)
    nom_client: str = Field(min_length=1, max_length=255)
    date_facture: date
    montant: Decimal = Field(gt=0)


class FactureUpdateRequest(FactureCreateRequest):
    pass


class FactureResponse(BaseModel):
    id: int
    numero_facture: str
    nom_client: str
    date_facture: date
    montant: Decimal


class AuditFactureResponse(BaseModel):
    id: int
    type_action: str
    date_modification: datetime
    numero_facture: str
    nom_client: str
    date_facture: date
    montant_ancien: Decimal | None
    montant_nouveau: Decimal | None
    utilisateur: str | None
    machine_hote: str | None
