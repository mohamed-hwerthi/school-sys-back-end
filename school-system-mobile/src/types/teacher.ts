/** A class the teacher is assigned to. Mirrors backend `ClasseResponseDTO`. */
export interface TeacherClasse {
  id: string;
  letter: string;
  niveauId: string;
  niveauName: string;
  fullName: string;
}

/** A student as seen by a teacher. Subset of backend `StudentResponseDTO`. */
export interface TeacherStudent {
  id: string;
  firstName: string;
  lastName: string;
  sex: string;
  classe: string;
  niveau: string;
  status: string;
  isBlocked: boolean;
  matricule: string | null;
  registrationNumber: string | null;
}

/** A timetable slot. Mirrors backend `EmploiDuTempsResponseDTO`. */
export interface TimetableEntry {
  id: string;
  classeId: string;
  creneauId: string;
  jourSemaine: number;
  moduleId: string | null;
  enseignantId: string | null;
  salle: string | null;
  classroomId: string | null;
}

/** A timetable time-slot (créneau). Mirrors backend `CreneauDTO`. */
export interface Creneau {
  id: string;
  label: string;
  heureDebut: string; // "HH:mm:ss"
  heureFin: string;
  type: string;
}

/** A teaching module/subject. Subset of backend `ModuleResponseDTO`. */
export interface TeacherModule {
  id: string;
  name: string;
  niveauId: string;
  niveauName: string;
}

/** Identifies a class across the teacher "Classes" stack screens. */
export interface ClassRef {
  classeId: string;
  niveauName: string;
  letter: string;
  fullName: string;
}

/** Navigation params for the teacher "Classes" stack. */
export type TeacherClassesStackParamList = {
  ClassesList: undefined;
  ClassStudents: ClassRef;
  Attendance: ClassRef;
  ExamSelect: ClassRef;
  GradeEntry: ClassRef & { examenId: string; examenName: string; trimestre: number };
  NotifyParent: { studentId: string; studentName: string };
};

/** Navigation params for the teacher "Plus" stack. */
export type TeacherMoreStackParamList = {
  MoreMenu: undefined;
  Discipline: undefined;
  QuizList: undefined;
  QuizDetail: { quizId: string };
  Messages: undefined;
  Notifications: undefined;
  Profil: undefined;
};

/** Navigation params for the teacher "Devoirs" stack. */
export type TeacherDevoirsStackParamList = {
  DevoirsList: undefined;
  DevoirForm: { devoirId?: string };
  DevoirDetail: { devoirId: string };
  SubmissionCorrection: { soumissionId: string; devoirId: string; pointsMax: number; studentName: string };
};
