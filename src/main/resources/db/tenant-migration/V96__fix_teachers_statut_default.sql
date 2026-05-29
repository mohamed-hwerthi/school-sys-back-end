-- Fix: Add DEFAULT 'Actif' to teachers.statut column
-- This migration properly sets the default value for PostgreSQL
-- (cannot be done with ALTER COLUMN SET DATA TYPE DEFAULT in one statement)

ALTER TABLE teachers
ALTER COLUMN statut SET DEFAULT 'Actif';

