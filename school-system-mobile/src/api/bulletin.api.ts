import api from "./axios";

/** A grade entry inside a module of a bulletin. */
export interface BulletinExamen {
  id: string;
  name: string;
  note: number | null;
  bareme: number | null;
  coefficient: number | null;
  trimestre: number | null;
}

/** Aggregated grades for a module (subject) in a bulletin. */
export interface BulletinModule {
  moduleId: string;
  moduleName: string;
  moduleNameAr: string | null;
  coefficient: number | null;
  moyenne: number | null;
  moyenneClasse: number | null;
  moyenneMin: number | null;
  moyenneMax: number | null;
  rang: number | null;
  appreciation: string | null;
  examens: BulletinExamen[];
}

/** A discipline group (domaine) collecting several modules. */
export interface BulletinDomaine {
  domaineId: string;
  domaineName: string;
  domaineNameAr: string | null;
  moyenne: number | null;
  modules: BulletinModule[];
}

/** A full bulletin for a single student/trimestre. Mirrors backend `BulletinDTO`. */
export interface Bulletin {
  studentId: string;
  matricule: string | null;
  studentName: string;
  studentNameAr: string | null;
  classe: string;
  niveau: string;
  trimestre: number;
  version: string;
  domaines: BulletinDomaine[];
  modulesHorsDomaine: BulletinModule[];
  moyenneGenerale: number | null;
  moyenneClasse: number | null;
  moyenneMin: number | null;
  moyenneMax: number | null;
  rang: number | null;
  totalEleves: number | null;
  certificatType: string | null;
  comportement: string | null;
}

export const bulletinApi = {
  /** Read a student's bulletin for a given trimestre (`READ_BULLETINS`). */
  getStudentBulletin: (
    studentId: string,
    classeId: string,
    trimestre: number,
    version: string = "etatique",
  ): Promise<Bulletin> =>
    api.get(`/bulletins/student/${studentId}`, { params: { classeId, trimestre, version } }),
};
