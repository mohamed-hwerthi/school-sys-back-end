CREATE TABLE audit_financier (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    user_id BIGINT,
    user_name VARCHAR(100),
    old_values TEXT,
    new_values TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
