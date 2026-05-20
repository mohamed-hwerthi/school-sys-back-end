import api from "./axios";

/** A teacher summary. Mirrors backend `TeacherResponseDTO`. */
export interface TeacherSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  specialization: string | null;
  sexe: string | null;
  telephone: string | null;
  dateNaissance: string | null;
  dateEmbauche: string | null;
  statut: string | null;
}

/** A class/module assignment for a teacher. Mirrors backend `AffectationDTO`. */
export interface Affectation {
  id: string;
  teacherId: string;
  teacherName: string;
  classeId: string;
  classeName: string;
  moduleId: string | null;
  moduleName: string | null;
  anneeScolaire: string | null;
  dateDebut: string | null;
  dateFin: string | null;
}

/** A student record. Mirrors backend `StudentResponseDTO`. */
export interface StudentRecord {
  id: string;
  firstName: string;
  lastName: string;
  firstNameAr: string | null;
  lastNameAr: string | null;
  sex: string;
  dateOfBirth: string | null;
  birthPlace: string | null;
  address: string | null;
  registrationNumber: string | null;
  email: string | null;
  classe: string | null;
  niveau: string | null;
  enrollmentDate: string | null;
  status: string;
  isBlocked: boolean;
  parentLastName: string | null;
  parentFirstName: string | null;
  parentPhone: string | null;
  parentEmail: string | null;
  notes: string | null;
  matricule: string | null;
}

interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface StudentListParams {
  page?: number;
  size?: number;
  search?: string;
  niveau?: string;
  classe?: string;
  status?: string;
  blocked?: boolean;
}

export interface TeacherListParams {
  page?: number;
  size?: number;
  search?: string;
  statut?: string;
}

export const adminApi = {
  /** First page of students — used only for its `totalElements` count. */
  getStudentsPage: (): Promise<{ totalElements: number }> =>
    api.get("/students", { params: { page: 0, size: 1 } }),

  /** Paginated, searchable list of students (`READ_STUDENTS`). */
  getStudents: (params: StudentListParams = {}): Promise<PagedResponse<StudentRecord>> =>
    api.get("/students", {
      params: { sortBy: "lastName", sortDir: "asc", size: 50, ...params },
    }),

  /** Full record of a single student (`READ_STUDENTS`). */
  getStudent: (id: string): Promise<StudentRecord> =>
    api.get(`/students/${id}`),

  /** All teachers of the school (`READ_TEACHERS`). */
  getTeachers: (): Promise<TeacherSummary[]> =>
    api.get("/teachers"),

  /** Paginated, searchable list of teachers (`READ_TEACHERS`). */
  getTeachersPage: (params: TeacherListParams = {}): Promise<PagedResponse<TeacherSummary>> =>
    api.get("/teachers/page", { params: { size: 30, ...params } }),

  /** Full record of a single teacher (`READ_TEACHERS`). */
  getTeacher: (id: string): Promise<TeacherSummary> =>
    api.get(`/teachers/${id}`),

  /** A teacher's class/module assignments (`MANAGE_TEACHERS`). */
  getTeacherAffectations: (teacherId: string): Promise<Affectation[]> =>
    api.get("/affectations", { params: { teacherId } }),
};
