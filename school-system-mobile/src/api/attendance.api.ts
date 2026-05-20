import api from "./axios";

export type AbsenceType = "ABSENCE" | "RETARD";

/** A recorded absence/lateness. Mirrors backend `AbsenceResponseDTO`. */
export interface AbsenceResponse {
  id: string;
  eleveId: string;
  date: string;
  type: string;
  seance: string | null;
  heureArrivee: string | null;
  justifie: boolean;
  motif: string | null;
  enseignantId: string | null;
}

/** One line of an attendance batch. Mirrors backend `AbsenceRequestDTO`. */
export interface AbsenceRequest {
  eleveId: string;
  date: string; // yyyy-MM-dd
  type: AbsenceType;
  seance: string;
  justifie?: boolean;
  motif?: string;
}

export const attendanceApi = {
  /** Absences recorded for a class on a given date (all séances). */
  getByClasseAndDate: (classeId: string, date: string): Promise<AbsenceResponse[]> =>
    api.get("/absences", { params: { classeId, date } }),

  /** Records a batch of absences/latenesses. */
  batchCreate: (absences: AbsenceRequest[]): Promise<AbsenceResponse[]> =>
    api.post("/absences/batch", { absences }),

  /** All absences recorded for a single student. */
  getStudentAbsences: (eleveId: string): Promise<AbsenceResponse[]> =>
    api.get(`/absences/eleve/${eleveId}`),
};
