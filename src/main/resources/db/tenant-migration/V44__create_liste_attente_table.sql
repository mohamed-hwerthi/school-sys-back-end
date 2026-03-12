CREATE TABLE liste_attente (
    id BIGSERIAL PRIMARY KEY,
    inscription_id BIGINT NOT NULL REFERENCES inscriptions(id),
    niveau_id BIGINT NOT NULL,
    position INTEGER NOT NULL,
    annee_scolaire VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_liste_attente_niveau ON liste_attente(niveau_id, annee_scolaire);
