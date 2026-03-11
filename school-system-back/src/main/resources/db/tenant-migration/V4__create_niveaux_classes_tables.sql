-- Niveaux (levels) and classes (sections) tables

CREATE TABLE IF NOT EXISTS niveaux (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
    id          BIGSERIAL       PRIMARY KEY,
    niveau_id   BIGINT          NOT NULL REFERENCES niveaux(id) ON DELETE CASCADE,
    letter      VARCHAR(5)      NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (niveau_id, letter)
);
