-- Domaines (groupes de matières : مجال اللغة العربية, مجال العلوم...)
CREATE TABLE IF NOT EXISTS domaines (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    name_ar         VARCHAR(255),
    ordre           INTEGER         NOT NULL DEFAULT 1,
    niveau_id       BIGINT          NOT NULL REFERENCES niveaux(id) ON DELETE CASCADE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Sous-domaines (sous-groupes optionnels : التنشئة الاجتماعية, التنشئة الفنية...)
CREATE TABLE IF NOT EXISTS sous_domaines (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    name_ar         VARCHAR(255),
    ordre           INTEGER         NOT NULL DEFAULT 1,
    domaine_id      BIGINT          NOT NULL REFERENCES domaines(id) ON DELETE CASCADE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Lier les modules aux domaines et sous-domaines
ALTER TABLE modules ADD COLUMN IF NOT EXISTS domaine_id BIGINT REFERENCES domaines(id) ON DELETE SET NULL;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS sous_domaine_id BIGINT REFERENCES sous_domaines(id) ON DELETE SET NULL;
