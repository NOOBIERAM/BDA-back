-- 1) Table utilisateur pour inscription/connexion
CREATE TABLE IF NOT EXISTS utilisateur (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE utilisateur
    DROP COLUMN IF EXISTS email;

-- 2) Mise a jour de audit_facture
ALTER TABLE audit_facture
    ADD COLUMN IF NOT EXISTS utilisateur VARCHAR(100),
    ADD COLUMN IF NOT EXISTS machine_hote VARCHAR(255);

-- 3) Fonction trigger: audit uniquement via trigger
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

-- 4) Trigger
DROP TRIGGER IF EXISTS tr_audit_facture ON facture;

CREATE TRIGGER tr_audit_facture
AFTER INSERT OR UPDATE OR DELETE ON facture
FOR EACH ROW
EXECUTE FUNCTION fn_audit_facture();
