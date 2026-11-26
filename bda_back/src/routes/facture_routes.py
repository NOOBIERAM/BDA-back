from dataclasses import asdict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.db import get_db
from controllers.audit_repository_impl import SQLAlchemyAuditRepository
from controllers.facture_repository_impl import SQLAlchemyFactureRepository
from models.entities import Utilisateur
from services.audit_context_service import inject_audit_context
from services.dependencies import get_current_user
from services.audit_use_case import ListAuditUseCase
from services.exceptions import NotFoundError
from services.facture_use_cases import (
    CreateFactureUseCase,
    DeleteFactureUseCase,
    ListFactureUseCase,
    UpdateFactureUseCase,
)
from shemas.facture_shema import (
    AuditFactureResponse,
    FactureCreateRequest,
    FactureResponse,
    FactureUpdateRequest,
)


router = APIRouter(tags=["Factures"])


def _inject_user_audit_context(db: Session, current_user: Utilisateur) -> None:
    inject_audit_context(db, current_user.username)


@router.post("/factures", response_model=FactureResponse, status_code=status.HTTP_201_CREATED)
def create_facture(
    payload: FactureCreateRequest,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    _inject_user_audit_context(db, current_user)
    use_case = CreateFactureUseCase(SQLAlchemyFactureRepository(db))
    facture = use_case.execute(payload.numero_facture, payload.nom_client, payload.date_facture, payload.montant)
    return FactureResponse(**asdict(facture))


@router.put("/factures/{facture_id}", response_model=FactureResponse)
def update_facture(
    facture_id: int,
    payload: FactureUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    _inject_user_audit_context(db, current_user)
    use_case = UpdateFactureUseCase(SQLAlchemyFactureRepository(db))

    try:
        facture = use_case.execute(
            facture_id=facture_id,
            numero_facture=payload.numero_facture,
            nom_client=payload.nom_client,
            date_facture=payload.date_facture,
            montant=payload.montant,
        )
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return FactureResponse(**asdict(facture))


@router.delete("/factures/{facture_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_facture(
    facture_id: int,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    _inject_user_audit_context(db, current_user)
    use_case = DeleteFactureUseCase(SQLAlchemyFactureRepository(db))

    try:
        use_case.execute(facture_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return None


@router.get(
    "/factures",
    response_model=list[FactureResponse],
    dependencies=[Depends(get_current_user)],
)
def list_factures(
    db: Session = Depends(get_db),
):
    use_case = ListFactureUseCase(SQLAlchemyFactureRepository(db))
    return [FactureResponse(**asdict(facture)) for facture in use_case.execute()]


# @router.get(
#     "/audit",
#     response_model=list[AuditFactureResponse],
#     tags=["Audit"],
#     dependencies=[Depends(get_current_user)],
# )
# def list_audit(
#     db: Session = Depends(get_db),
# ):
#     use_case = ListAuditUseCase(SQLAlchemyAuditRepository(db))
#     return [AuditFactureResponse(**asdict(audit)) for audit in use_case.execute()]
@router.get("/audit", response_model=list[AuditFactureResponse], tags=["Audit"])
def list_audit(
    db: Session = Depends(get_db),
):
    inject_audit_context(db, "system")
    use_case = ListAuditUseCase(SQLAlchemyAuditRepository(db))
    return [AuditFactureResponse(**asdict(audit)) for audit in use_case.execute()]
