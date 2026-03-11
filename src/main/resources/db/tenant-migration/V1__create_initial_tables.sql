-- Initial DDL for each school schema.
-- This migration runs when a new tenant is registered
-- and on application startup for all existing tenants.

CREATE TABLE IF NOT EXISTS students (
    id                  BIGSERIAL       PRIMARY KEY,
    first_name          VARCHAR(255)    NOT NULL,
    last_name           VARCHAR(255)    NOT NULL,
    email               VARCHAR(255)    NOT NULL UNIQUE,
    date_of_birth       DATE,
    registration_number VARCHAR(255)    UNIQUE
);

CREATE TABLE IF NOT EXISTS teachers (
    id              BIGSERIAL       PRIMARY KEY,
    first_name      VARCHAR(255)    NOT NULL,
    last_name       VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    specialization  VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS courses (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,
    code            VARCHAR(255)    NOT NULL UNIQUE,
    teacher_id      BIGINT          REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS classrooms (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    capacity        INTEGER,
    location        VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id                  BIGSERIAL       PRIMARY KEY,
    student_id          BIGINT          NOT NULL REFERENCES students(id),
    course_id           BIGINT          NOT NULL REFERENCES courses(id),
    enrollment_date     DATE,
    status              VARCHAR(50)
);
