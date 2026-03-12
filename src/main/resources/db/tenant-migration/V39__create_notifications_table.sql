CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'WARNING', 'ALERT', 'FINANCE', 'ABSENCE', 'NOTE', 'DISCIPLINE')),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE annonces (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    contenu TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'GENERAL' CHECK (type IN ('GENERAL', 'URGENT', 'EVENEMENT', 'REUNION')),
    destinataires VARCHAR(50) NOT NULL DEFAULT 'TOUS' CHECK (destinataires IN ('TOUS', 'PARENTS', 'ENSEIGNANTS', 'ELEVES', 'CLASSE')),
    classe_id BIGINT,
    auteur_id BIGINT,
    auteur_name VARCHAR(100),
    date_publication TIMESTAMP DEFAULT NOW(),
    date_expiration TIMESTAMP,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
