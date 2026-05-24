import api from "./axios";

// ---- Types (mirror back DTOs) ----

export interface UpcomingDevoir {
  id: string;
  titre: string;
  moduleNom: string | null;
  dateLimite: string; // ISO date
  type: string;
}

export interface UpcomingExamen {
  id: string;
  name: string;
  moduleNom: string | null;
  trimestre: number;
  dateLimiteSaisie: string;
}

export interface UpcomingPaiement {
  id: string;
  typeFraisNom: string | null;
  mois: string;
  anneeScolaire: string;
  montantDu: string;
  montantPaye: string;
  statut: "PAYE" | "PARTIEL" | "EN_ATTENTE" | "EN_RETARD";
}

export interface UpcomingPayload {
  devoirs: UpcomingDevoir[];
  examens: UpcomingExamen[];
  paiements: UpcomingPaiement[];
}

export interface TrendPoint {
  trimestre: number;
  moyenne: number;
  noteCount: number;
}

export interface TrendPayload {
  points: TrendPoint[];
}

export interface AlertsPayload {
  absencesNonJustifiees: number;
  retards: number;
  incidentsRecents: number;
}

// ---- API ----

export const parentPortalApi = {
  getChildren: (): Promise<any[]> =>
    api.get("/parent-portal/children"),

  getChildNotes: (studentId: string, trimestre = 1): Promise<any[]> =>
    api.get(`/parent-portal/children/${studentId}/notes`, { params: { trimestre } }),

  getChildAbsences: (studentId: string): Promise<any[]> =>
    api.get(`/parent-portal/children/${studentId}/absences`),

  getChildBulletin: (studentId: string, classeId: string, trimestre = 1): Promise<any> =>
    api.get(`/parent-portal/children/${studentId}/bulletin`, { params: { classeId, trimestre } }),

  getChildEmploiDuTemps: (studentId: string): Promise<any[]> =>
    api.get(`/parent-portal/children/${studentId}/emploi-du-temps`),

  /** MOB-FUNC-001 — devoirs / examens / paiements dans les N prochains jours */
  getUpcoming: (studentId: string, days = 7): Promise<UpcomingPayload> =>
    api.get(`/parent-portal/children/${studentId}/upcoming`, { params: { days } }),

  /** MOB-FUNC-002 — moyenne par trimestre (sparkline) */
  getTrend: (studentId: string): Promise<TrendPayload> =>
    api.get(`/parent-portal/children/${studentId}/trend`),

  /** MOB-FUNC-004 — compteurs d'alertes (absences non justifiées, retards, incidents) */
  getAlerts: (studentId: string): Promise<AlertsPayload> =>
    api.get(`/parent-portal/children/${studentId}/alerts`),

  /** MOB-FUNC-007 — notes par matière sur les 3 trimestres */
  getProgress: (studentId: string): Promise<ProgressPayload> =>
    api.get(`/parent-portal/children/${studentId}/progress`),

  /** MOB-FUNC-008 — événements calendrier entre deux dates */
  getCalendar: (studentId: string, from: string, to: string): Promise<CalendarPayload> =>
    api.get(`/parent-portal/children/${studentId}/calendar`, { params: { from, to } }),

  /** MOB-FUNC-010 — profil complet enfant avec bulletin courant + classement */
  getFullProfile: (studentId: string, trimestre = 1): Promise<FullProfilePayload> =>
    api.get(`/parent-portal/children/${studentId}/full-profile`, { params: { trimestre } }),
};

// ---- MOB-FUNC-007 — progress ----

export interface MatiereProgress {
  moduleId: string;
  moduleNom: string;
  t1: number | null;
  t2: number | null;
  t3: number | null;
  /** "haut" | "stable" | "bas" */
  tendance: string;
}

export interface ProgressPayload {
  matieres: MatiereProgress[];
}

// ---- MOB-FUNC-008 — calendar ----

export interface CalendarEvent {
  id: string;
  type: "DEVOIR" | "EXAMEN" | "EVENEMENT";
  titre: string;
  subtitle: string | null;
  date: string;
  couleur: string;
}

export interface CalendarPayload {
  events: CalendarEvent[];
}

// ---- MOB-FUNC-010 — full profile ----

export interface FullProfilePayload {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string | null;
  niveau: string | null;
  classe: string | null;
  sexe: string | null;
  dateOfBirth: string | null;
  enrollmentDate: string | null;
  status: string | null;
  currentBulletin: any | null;
  rangClasse: number | null;
  effectifClasse: number | null;
  moyenneTrimestre: number | null;
}
