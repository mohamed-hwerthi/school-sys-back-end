CREATE TABLE parent_students (
    id BIGSERIAL PRIMARY KEY,
    parent_user_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL REFERENCES students(id),
    relation VARCHAR(30) DEFAULT 'PARENT' CHECK (relation IN ('PARENT', 'TUTEUR', 'AUTRE')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(parent_user_id, student_id)
);
