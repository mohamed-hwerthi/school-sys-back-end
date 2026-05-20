import api from "./axios";

/** A student involved in an incident. */
export interface IncidentEleve {
  id: string;
  eleveId: string;
  roleEleve: string;
}

/** A discipline incident. Mirrors backend `IncidentResponseDTO`. */
export interface Incident {
  id: string;
  titre: string;
  description: string | null;
  date: string | null;
  type: string;
  gravite: string;
  lieu: string | null;
  signaleParId: string | null;
  elevesImpliques: IncidentEleve[];
}

/** An entry of a student's disciplinary timeline. */
export interface DossierEvent {
  id: string;
  date: string;
  type: string;
  description: string | null;
  gravite: string | null;
  niveau: number | null;
  statut: string | null;
}

/** A student's full discipline file. Mirrors backend `DossierDisciplinaireDTO`. */
export interface StudentDossier {
  eleveId: string;
  eleveNom: string;
  totalIncidents: number;
  totalSanctions: number;
  niveauActuel: number;
  timeline: DossierEvent[];
}

/** A sanction. Mirrors backend `SanctionResponseDTO`. */
export interface Sanction {
  id: string;
  eleveId: string;
  incidentId: string | null;
  type: string;
  description: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  niveau: number | null;
  statut: string;
  approuvePar: string | null;
  commentaireApprobation: string | null;
}

export const incidentsApi = {
  /** All discipline incidents — read-only for teachers (`READ_DISCIPLINE`). */
  getIncidents: (): Promise<Incident[]> =>
    api.get("/discipline/incidents"),

  /** Single incident detail. */
  getIncident: (id: string): Promise<Incident> =>
    api.get(`/discipline/incidents/${id}`),

  /** Sanctions attached to an incident. */
  getSanctionsByIncident: (incidentId: string): Promise<Sanction[]> =>
    api.get(`/discipline/sanctions/incident/${incidentId}`),

  /** Approves a pending sanction (`WRITE_DISCIPLINE` — admin/directeur). */
  approveSanction: (id: string, body: { approuveParId?: string; commentaire?: string }): Promise<Sanction> =>
    api.post(`/discipline/sanctions/${id}/approuver`, body),

  /** Lifts an active sanction (`WRITE_DISCIPLINE`). */
  liftSanction: (id: string): Promise<Sanction> =>
    api.post(`/discipline/sanctions/${id}/lever`),

  /** Full discipline file of a single student. */
  getStudentDossier: (eleveId: string): Promise<StudentDossier> =>
    api.get(`/discipline/dossier/${eleveId}`),
};
