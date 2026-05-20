import api from "./axios";

/** Attendance for one day. Mirrors backend `DayAttendanceDTO`. */
export interface DayAttendance {
  jour: string;
  presents: number;
  absents: number;
}

/** An upcoming calendar event. Mirrors backend `UpcomingEventDTO`. */
export interface UpcomingEvent {
  id: string;
  titre: string;
  dateDebut: string | null;
  couleur: string | null;
  type: string | null;
  lieu: string | null;
}

/** A recently enrolled student. Mirrors backend `RecentStudentDTO`. */
export interface RecentStudent {
  id: string;
  fullName: string;
  classe: string | null;
  enrollmentDate: string | null;
  statut: string | null;
}

/** School dashboard stats. Mirrors backend `DashboardStatsDTO`. */
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  totalPending: number;
  tauxRecouvrement: number;
  tauxAbsence: number;
  moyenneGenerale: number;
  studentsByNiveau: Record<string, number>;
  absencesToday: number;
  newEnrollmentsThisMonth: number;
  eventsThisMonth: number;
  weeklyAttendance: DayAttendance[];
  upcomingEvents: UpcomingEvent[];
  recentStudents: RecentStudent[];
}

/** A monthly trend point. Mirrors backend `MonthlyTrendDTO`. */
export interface MonthlyTrend {
  month: string;
  inscriptions: number;
  paiements: number;
  absences: number;
}

/** Per-class summary stats for the admin "Stats" view. Mirrors backend `ClassStatsDTO`. */
export interface ClassStats {
  classeId: string;
  classeName: string;
  niveauName: string;
  nbEleves: number;
  moyenne: number;
  tauxReussite: number;
  tauxPresence: number;
  totalAbsences: number;
  totalRetards: number;
  totalAbsencesJustifiees: number;
}

export const reportingApi = {
  /** School dashboard stats (`VIEW_REPORTS`). */
  getDashboard: (anneeScolaire?: string): Promise<DashboardStats> =>
    api.get("/reporting/dashboard", { params: anneeScolaire ? { anneeScolaire } : undefined }),

  /** Monthly trends for the school year (`VIEW_REPORTS`). */
  getTrends: (anneeScolaire?: string): Promise<MonthlyTrend[]> =>
    api.get("/reporting/trends", { params: anneeScolaire ? { anneeScolaire } : undefined }),

  /** Per-class stats for a given trimestre (`VIEW_REPORTS`). */
  getClassStats: (trimestre: number): Promise<ClassStats[]> =>
    api.get("/reporting/admin/class-stats", { params: { trimestre } }),
};
