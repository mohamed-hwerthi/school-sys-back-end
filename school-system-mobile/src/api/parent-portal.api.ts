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
};
