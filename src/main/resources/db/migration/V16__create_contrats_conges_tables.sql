CREATE TABLE IF NOT EXISTS contrats_enseignant (
    id BIGSERIAL PRIMARY KEY,
    enseignant_id BIGINT NOT NULL REFERENCES teachers(id),
    type_contrat VARCHAR(30) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    salaire NUMERIC(10,2) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF',
    observations TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conges (
    id BIGSERIAL PRIMARY KEY,
    enseignant_id BIGINT NOT NULL REFERENCES teachers(id),
    type_conge VARCHAR(30) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    motif TEXT,
    statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contrats_enseignant ON contrats_enseignant(enseignant_id);
CREATE INDEX idx_conges_enseignant ON conges(enseignant_id);
