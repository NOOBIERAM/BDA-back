from models.entities import Utilisateur
from repository.user_repository import UserRepository
from services.auth_service import create_access_token, hash_password, verify_password
from services.exceptions import DuplicateUserError, InvalidCredentialsError


class RegisterUserUseCase:
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def execute(self, username: str, password: str) -> Utilisateur:
        if self.user_repository.get_by_username(username):
            raise DuplicateUserError("Username already exists")

        password_hash = hash_password(password)
        return self.user_repository.create(username=username, password_hash=password_hash)


class LoginUserUseCase:
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def execute(self, username: str, password: str) -> str:
        user = self.user_repository.get_by_username(username)
        if user is None or not verify_password(password, user.password_hash):
            raise InvalidCredentialsError("Invalid username or password")
        return create_access_token(user.username)
