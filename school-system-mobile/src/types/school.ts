/**
 * A school the user can select before logging in.
 * Mirrors the backend `PublicSchoolDTO` (minimal, safe-to-expose projection).
 */
export interface School {
  id: string;
  name: string;
  slug: string;
}
