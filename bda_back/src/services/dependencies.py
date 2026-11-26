from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from config.db import get_db
from controllers.user_repository_impl import SQLAlchemyUserRepository
from models.entities import Utilisateur


def get_current_user(request: Request, db: Session = Depends(get_db)) -> Utilisateur:
    username = getattr(request.state, "current_username", None)
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_repo = SQLAlchemyUserRepository(db)
    user = user_repo.get_by_username(username)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user
