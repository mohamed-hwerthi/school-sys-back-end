CREATE TABLE IF NOT EXISTS remplacements (
    id BIGSERIAL PRIMARY KEY,
    emploi_du_temps_id BIGINT NOT NULL REFERENCES emploi_du_temps(id) ON DELETE CASCADE,
    enseignant_remplacant_id BIGINT NOT NULL REFERENCES teachers(id),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    motif VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
