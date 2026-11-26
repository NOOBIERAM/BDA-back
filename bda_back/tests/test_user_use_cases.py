from models.entities import Utilisateur
from repository.user_repository import UserRepository
from services.user_use_cases import LoginUserUseCase, RegisterUserUseCase


class FakeUserRepository(UserRepository):
    def __init__(self):
        self.users = []

    def create(self, username: str, password_hash: str) -> Utilisateur:
        user = Utilisateur(id=len(self.users) + 1, username=username, password_hash=password_hash)
        self.users.append(user)
        return user

    def get_by_username(self, username: str) -> Utilisateur | None:
        for user in self.users:
            if user.username == username:
                return user
        return None


def test_register_and_login_use_cases():
    repo = FakeUserRepository()
    register = RegisterUserUseCase(repo)
    login = LoginUserUseCase(repo)

    user = register.execute("alice", "password123")

    assert user.id == 1
    assert user.password_hash != "password123"

    token = login.execute("alice", "password123")
    assert isinstance(token, str)
    assert len(token) > 10
