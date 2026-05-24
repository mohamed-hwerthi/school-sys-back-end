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

  /** Teacher-scoped class stats (`READ_NOTES`) — limited to the caller's classes. */
  getMyClassStats: (trimestre: number): Promise<ClassStats[]> =>
    api.get("/reporting/teacher/my-class-stats", { params: { trimestre } }),

  /** MOB-FUNC-016 — distribution des notes par tranches pour une classe. */
  getGradeDistribution: (
    classeId: string,
    trimestre: number,
    moduleId?: string,
  ): Promise<GradeDistribution> =>
    api.get(`/reporting/class/${classeId}/grade-distribution`, {
      params: { trimestre, ...(moduleId ? { moduleId } : {}) },
    }),

  /** MOB-FUNC-017 — évolution trimestrielle d'une classe avec moyenne école. */
  getTrimestreEvolution: (classeId: string): Promise<TrimestreEvolution> =>
    api.get(`/reporting/class/${classeId}/trimestre-evolution`),

  /** MOB-FUNC-018 — top et flop élèves d'une classe pour un trimestre. */
  getTopFlop: (classeId: string, trimestre: number, limit = 5): Promise<TopFlop> =>
    api.get(`/reporting/class/${classeId}/top-flop`, { params: { trimestre, limit } }),

  /** MOB-FUNC-029 — liste complète des élèves d'une classe avec stats. */
  getClassStudentsStats: (classeId: string, trimestre: number): Promise<StudentStats[]> =>
    api.get(`/reporting/class/${classeId}/students-stats`, { params: { trimestre } }),

  /** MOB-FUNC-030 — comparaison des classes d'un niveau. */
  getClassesComparison: (niveauName: string, trimestre: number): Promise<ClassStats[]> =>
    api.get(`/reporting/niveau/${encodeURIComponent(niveauName)}/classes-comparison`, {
      params: { trimestre },
    }),
};

// ---- Drill-down types (mirror back ClassDrillDownDTO) ----

export interface GradeBucket {
  range: string;
  count: number;
}

export interface GradeDistribution {
  buckets: GradeBucket[];
  totalNotes: number;
}

export interface TrimestrePoint {
  trimestre: number;
  moyenne: number;
  tauxReussite: number;
  tauxPresence: number;
  moyenneEcole: number;
}

export interface TrimestreEvolution {
  points: TrimestrePoint[];
}

export interface StudentRank {
  studentId: string;
  prenom: string;
  nom: string;
  moyenne: number;
  rang: number;
}

export interface TopFlop {
  top: StudentRank[];
  flop: StudentRank[];
}

export interface StudentStats {
  studentId: string;
  prenom: string;
  nom: string;
  matricule: string | null;
  moyenne: number | null;
  rang: number | null;
  totalAbsences: number;
  totalRetards: number;
}
