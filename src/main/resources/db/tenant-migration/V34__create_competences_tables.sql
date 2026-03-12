CREATE TABLE IF NOT EXISTS competences (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT REFERENCES modules(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evaluations_competences (
    id BIGSERIAL PRIMARY KEY,
    eleve_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    competence_id BIGINT NOT NULL REFERENCES competences(id) ON DELETE CASCADE,
    examen_id BIGINT NOT NULL REFERENCES examens(id) ON DELETE CASCADE,
    niveau VARCHAR(20) NOT NULL CHECK (niveau IN ('NON_ATTEINT', 'EN_COURS', 'ATTEINT', 'DEPASSE')),
    commentaire TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(eleve_id, competence_id, examen_id)
);
