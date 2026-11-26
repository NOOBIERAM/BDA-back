from dataclasses import dataclass
from datetime import datetime, date
from decimal import Decimal


@dataclass(slots=True)
class Utilisateur:
    id: int | None
    username: str
    password_hash: str
    created_at: datetime | None = None


@dataclass(slots=True)
class Facture:
    id: int | None
    numero_facture: str
    nom_client: str
    date_facture: date
    montant: Decimal


@dataclass(slots=True)
class AuditFacture:
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
