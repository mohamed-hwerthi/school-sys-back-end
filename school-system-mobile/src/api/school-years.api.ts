import api from "./axios";

/** A school year. Subset of backend `AnneeScolaireResponseDTO`. */
export interface SchoolYear {
  id: string;
  label: string;
  dateDebut: string | null;
  dateFin: string | null;
  active: boolean;
  cloturee: boolean;
}

export const schoolYearsApi = {
  /** List all school years. */
  list: (): Promise<SchoolYear[]> =>
    api.get("/annees-scolaires"),

  /** The currently active school year. */
  getActive: (): Promise<SchoolYear> =>
    api.get("/annees-scolaires/active"),

  /** Marks a school year as the active one (`MANAGE_ANNEE_SCOLAIRE`). */
  activate: (id: string): Promise<SchoolYear> =>
    api.put(`/annees-scolaires/${id}/activate`),

  /** Closes (clôture) a school year (`MANAGE_ANNEE_SCOLAIRE`). */
  cloturer: (id: string): Promise<SchoolYear> =>
    api.put(`/annees-scolaires/${id}/cloturer`),
};
