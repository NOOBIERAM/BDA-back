class DomainError(Exception):
    pass


class DuplicateUserError(DomainError):
    pass


class InvalidCredentialsError(DomainError):
    pass


class NotFoundError(DomainError):
    pass
