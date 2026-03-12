CREATE TABLE IF NOT EXISTS factures (
    id BIGSERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL REFERENCES students(id),
    date_emission DATE NOT NULL DEFAULT CURRENT_DATE,
    date_echeance DATE,
    montant_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    montant_paye NUMERIC(10,2) NOT NULL DEFAULT 0,
    statut VARCHAR(20) NOT NULL DEFAULT 'BROUILLON',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS facture_lignes (
    id BIGSERIAL PRIMARY KEY,
    facture_id BIGINT NOT NULL REFERENCES factures(id) ON DELETE CASCADE,
    designation VARCHAR(255) NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 1,
    prix_unitaire NUMERIC(10,2) NOT NULL,
    montant NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS echeanciers (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    annee_scolaire VARCHAR(9) NOT NULL,
    montant_total NUMERIC(10,2) NOT NULL,
    nombre_echeances INTEGER NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS echeances (
    id BIGSERIAL PRIMARY KEY,
    echeancier_id BIGINT NOT NULL REFERENCES echeanciers(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    date_echeance DATE NOT NULL,
    montant NUMERIC(10,2) NOT NULL,
    montant_paye NUMERIC(10,2) NOT NULL DEFAULT 0,
    statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    date_paiement DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_factures_student ON factures(student_id);
CREATE INDEX idx_facture_lignes_facture ON facture_lignes(facture_id);
CREATE INDEX idx_echeanciers_student ON echeanciers(student_id);
CREATE INDEX idx_echeances_echeancier ON echeances(echeancier_id);
