"""add utilisateur table and audit trigger context fields

Revision ID: 20260304_01
Revises:
Create Date: 2026-03-04 22:30:00
"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260304_01"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS facture (
            id SERIAL PRIMARY KEY,
            numero_facture VARCHAR(100) NOT NULL,
            nom_client VARCHAR(255) NOT NULL,
            date_facture DATE NOT NULL,
            montant NUMERIC(12,2) NOT NULL
        );
        """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS audit_facture (
            id SERIAL PRIMARY KEY,
            type_action VARCHAR(10) NOT NULL,
            date_modification TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            numero_facture VARCHAR(100) NOT NULL,
            nom_client VARCHAR(255) NOT NULL,
            date_facture DATE NOT NULL,
            montant_ancien NUMERIC(12,2),
            montant_nouveau NUMERIC(12,2)
        );
        """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS utilisateur (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        """
    )

    op.execute(
        """
        ALTER TABLE IF EXISTS audit_facture
            ADD COLUMN IF NOT EXISTS utilisateur VARCHAR(100),
            ADD COLUMN IF NOT EXISTS machine_hote VARCHAR(255);
        """
    )

    op.execute(
        """
        CREATE OR REPLACE FUNCTION fn_audit_facture()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        AS $$
        DECLARE
            v_user TEXT;
            v_machine TEXT;
        BEGIN
            v_user := current_setting('myapp.current_user', true);
            v_machine := current_setting('application_name', true);

            IF TG_OP = 'INSERT' THEN
                INSERT INTO audit_facture (
                    type_action,
                    date_modification,
                    numero_facture,
                    nom_client,
                    date_facture,
                    montant_ancien,
                    montant_nouveau,
                    utilisateur,
                    machine_hote
                ) VALUES (
                    'INSERT',
                    NOW(),
                    NEW.numero_facture,
                    NEW.nom_client,
                    NEW.date_facture,
                    NULL,
                    NEW.montant,
                    COALESCE(v_user, 'unknown'),
                    COALESCE(v_machine, 'unknown')
                );
                RETURN NEW;

            ELSIF TG_OP = 'UPDATE' THEN
                INSERT INTO audit_facture (
                    type_action,
                    date_modification,
                    numero_facture,
                    nom_client,
                    date_facture,
                    montant_ancien,
                    montant_nouveau,
                    utilisateur,
                    machine_hote
                ) VALUES (
                    'UPDATE',
                    NOW(),
                    NEW.numero_facture,
                    NEW.nom_client,
                    NEW.date_facture,
                    OLD.montant,
                    NEW.montant,
                    COALESCE(v_user, 'unknown'),
                    COALESCE(v_machine, 'unknown')
                );
                RETURN NEW;

            ELSIF TG_OP = 'DELETE' THEN
                INSERT INTO audit_facture (
                    type_action,
                    date_modification,
                    numero_facture,
                    nom_client,
                    date_facture,
                    montant_ancien,
                    montant_nouveau,
                    utilisateur,
                    machine_hote
                ) VALUES (
                    'DELETE',
                    NOW(),
                    OLD.numero_facture,
                    OLD.nom_client,
                    OLD.date_facture,
                    OLD.montant,
                    NULL,
                    COALESCE(v_user, 'unknown'),
                    COALESCE(v_machine, 'unknown')
                );
                RETURN OLD;
            END IF;

            RETURN NULL;
        END;
        $$;
        """
    )

    op.execute(
        """
        DO $$
        BEGIN
            IF to_regclass('public.facture') IS NOT NULL THEN
                EXECUTE 'DROP TRIGGER IF EXISTS tr_audit_facture ON facture';
                EXECUTE '
                    CREATE TRIGGER tr_audit_facture
                    AFTER INSERT OR UPDATE OR DELETE ON facture
                    FOR EACH ROW
                    EXECUTE FUNCTION fn_audit_facture()
                ';
            END IF;
        END
        $$;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DO $$
        BEGIN
            IF to_regclass('public.facture') IS NOT NULL THEN
                EXECUTE 'DROP TRIGGER IF EXISTS tr_audit_facture ON facture';
            END IF;
        END
        $$;
        """
    )
    op.execute("DROP FUNCTION IF EXISTS fn_audit_facture();")

    op.execute(
        """
        ALTER TABLE IF EXISTS audit_facture
            DROP COLUMN IF EXISTS machine_hote,
            DROP COLUMN IF EXISTS utilisateur;
        """
    )

    op.execute("DROP TABLE IF EXISTS utilisateur;")
    op.execute("DROP TABLE IF EXISTS audit_facture;")
    op.execute("DROP TABLE IF EXISTS facture;")
