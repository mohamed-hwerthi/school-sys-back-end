CREATE TABLE IF NOT EXISTS incidents (
    id BIGSERIAL PRIMARY KEY,
    date_incident DATE NOT NULL,
    type_incident VARCHAR(50) NOT NULL CHECK (type_incident IN ('BAGARRE','INSOLENCE','VANDALISME','TRICHERIE','RETARD_REPETE','ABSENCE_INJUSTIFIEE','AUTRE')),
    description TEXT,
    gravite VARCHAR(20) NOT NULL DEFAULT 'MOYENNE' CHECK (gravite IN ('LEGERE','MOYENNE','GRAVE','TRES_GRAVE')),
    enseignant_id BIGINT REFERENCES teachers(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incident_eleves (
    id BIGSERIAL PRIMARY KEY,
    incident_id BIGINT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    eleve_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE(incident_id, eleve_id)
);

CREATE TABLE IF NOT EXISTS sanctions (
    id BIGSERIAL PRIMARY KEY,
    incident_id BIGINT REFERENCES incidents(id),
    eleve_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    type_sanction VARCHAR(30) NOT NULL CHECK (type_sanction IN ('AVERTISSEMENT','BLAME','EXCLUSION_TEMPORAIRE','EXCLUSION_DEFINITIVE','TRAVAIL_SUPPLEMENTAIRE','CONVOCATION_PARENT')),
    description TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE,
    notifie_parent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sanctions_eleve ON sanctions(eleve_id);
CREATE INDEX idx_incidents_date ON incidents(date_incident);
