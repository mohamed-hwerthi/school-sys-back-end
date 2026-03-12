CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'MESSAGE' CHECK (type IN ('MESSAGE','CIRCULAIRE')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_recipients (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    recipient_id BIGINT NOT NULL,
    read_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_msg_recipients ON message_recipients(recipient_id, deleted);
CREATE INDEX idx_msg_created ON messages(created_at DESC);
