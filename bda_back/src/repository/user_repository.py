from abc import ABC, abstractmethod

from models.entities import Utilisateur


class UserRepository(ABC):
    @abstractmethod
    def create(self, username: str, password_hash: str) -> Utilisateur:
        raise NotImplementedError

    @abstractmethod
    def get_by_username(self, username: str) -> Utilisateur | None:
        raise NotImplementedError
