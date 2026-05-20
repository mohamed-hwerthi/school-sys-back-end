import api from "./axios";

/** An exam. Subset of backend `ExamenResponseDTO`. */
export interface Examen {
  id: string;
  name: string;
  trimestre: number;
  classeId: string;
  classeName: string;
  moduleId: string | null;
  moduleName: string | null;
  nbNotes: number;
  nbEleves: number;
}

/** A recorded grade. Mirrors backend `NoteResponseDTO`. */
export interface NoteResponse {
  id: string;
  studentId: string;
  studentName: string;
  examenId: string;
  examenName: string | null;
  trimestre: number;
  valeur: number | null;
  observation: string | null;
  statut: string | null;
}

/** One line of a bulk grade upsert. Mirrors backend `NoteRequestDTO`. */
export interface NoteRequest {
  studentId: string;
  examenId: string;
  trimestre: number;
  valeur: number;
  observation?: string;
}

export const gradesApi = {
  /** Exams for a class in a given trimester (scoped to the teacher server-side). */
  getExamens: (classeId: string, trimestre: number): Promise<Examen[]> =>
    api.get("/examens", { params: { classeId, trimestre } }),

  /** Grades already recorded for an exam. */
  getNotes: (examenId: string, trimestre: number): Promise<NoteResponse[]> =>
    api.get("/notes", { params: { examenId, trimestre } }),

  /** Creates or updates a batch of grades (server-side upsert). */
  bulkUpsertNotes: (notes: NoteRequest[]): Promise<NoteResponse[]> =>
    api.post("/notes/bulk", { notes }),

  /** All grades for a single student in the given trimester. */
  getStudentNotes: (studentId: string, trimestre: number): Promise<NoteResponse[]> =>
    api.get(`/notes/student/${studentId}`, { params: { trimestre } }),
};
