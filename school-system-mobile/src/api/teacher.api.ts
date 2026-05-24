import api from "./axios";
import type {
  TeacherClasse,
  TeacherStudent,
  TimetableEntry,
  Creneau,
  TeacherModule,
} from "@/types/teacher";

/** Spring `PagedResponse<T>` wrapper. */
interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const teacherApi = {
  /** Classes the authenticated teacher is assigned to (scoped server-side). */
  getClasses: (): Promise<TeacherClasse[]> =>
    api.get("/classes"),

  /** Students of a class, identified by its niveau name + letter. */
  getStudents: (niveau: string, classe: string): Promise<PagedResponse<TeacherStudent>> =>
    api.get("/students", {
      params: { niveau, classe, size: 200, sortBy: "lastName", sortDir: "asc" },
    }),

  /** The authenticated teacher's weekly timetable. */
  getMyTimetable: (): Promise<TimetableEntry[]> =>
    api.get("/emploi-du-temps/me"),

  /** Timetable time-slots (créneaux). */
  getCreneaux: (): Promise<Creneau[]> =>
    api.get("/creneaux"),

  /** All teaching modules — used to resolve module names in the timetable. */
  getModules: (): Promise<TeacherModule[]> =>
    api.get("/modules"),

  /** MOB-FUNC-012 — devoirs avec soumissions non corrigées + quiz à valider. */
  getPendingCorrections: (): Promise<PendingCorrections> =>
    api.get("/teacher/pending-corrections"),

  /** MOB-FUNC-013 — top N élèves à surveiller. */
  getStudentsAtRisk: (limit = 5): Promise<StudentAtRisk[]> =>
    api.get("/teacher/students-at-risk", { params: { limit } }),

  /** MOB-FUNC-014 — examens dont les notes ne sont pas saisies. */
  getPendingTasks: (): Promise<PendingTasks> =>
    api.get("/teacher/pending-tasks"),
};

// ---- Types (mirror back TeacherHomeDTO) ----

export interface PendingCorrections {
  devoirs: number;
  quiz: number;
}

export interface StudentAtRisk {
  studentId: string;
  prenom: string;
  nom: string;
  classeNom: string;
  /** "moyenne_faible" | "absences_repetees" */
  motif: string;
  valeur: number;
}

export interface PendingTask {
  /** "PRESENCE" | "NOTE" */
  kind: string;
  date: string;
  classeNom: string | null;
  moduleNom: string | null;
  label: string;
}

export interface PendingTasks {
  items: PendingTask[];
  total: number;
}
