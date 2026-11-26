"""remove email from utilisateur

Revision ID: 20260307_02
Revises: 20260304_01
Create Date: 2026-03-07 18:30:00
"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260307_02"
down_revision: Union[str, Sequence[str], None] = "20260304_01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE IF EXISTS utilisateur
            DROP COLUMN IF EXISTS email;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE IF EXISTS utilisateur
            ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        """
    )
