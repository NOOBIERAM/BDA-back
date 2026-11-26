from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.db import get_db
from controllers.user_repository_impl import SQLAlchemyUserRepository
from services.exceptions import DuplicateUserError, InvalidCredentialsError
from services.user_use_cases import LoginUserUseCase, RegisterUserUseCase
from shemas.auth_shema import LoginRequest, RegisterRequest, TokenResponse, UserResponse


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    use_case = RegisterUserUseCase(SQLAlchemyUserRepository(db))
    try:
        user = use_case.execute(payload.username, payload.password)
    except DuplicateUserError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc

    return UserResponse(
        id=user.id,
        username=user.username,
        created_at=user.created_at,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    use_case = LoginUserUseCase(SQLAlchemyUserRepository(db))
    try:
        token = use_case.execute(payload.username, payload.password)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    return TokenResponse(access_token=token)
