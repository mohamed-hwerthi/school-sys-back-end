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
};
