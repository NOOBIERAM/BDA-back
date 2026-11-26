import socket

from sqlalchemy import text
from sqlalchemy.orm import Session


def inject_audit_context(db: Session, username: str) -> None:
    machine_hote = socket.gethostname()
    db.execute(
        text("SELECT set_config('application_name', :machine_hote, true)"),
        {"machine_hote": machine_hote},
    )
    db.execute(
        text("SELECT set_config('myapp.current_user', :username, true)"),
        {"username": username},
    )
