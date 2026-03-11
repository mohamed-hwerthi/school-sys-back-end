import api from "./axios";

export interface BulletinExamenDTO {
  examenId: number;
  examenName: string;
  coeff: number;
  note: number | null;
}

export interface BulletinModuleDTO {
  moduleId: number;
  moduleName: string;
  coeff: number;
  ordre: number;
  examens: BulletinExamenDTO[];
  moyenneModule: number;
  moduleMin: number;
  moduleMax: number;
  moduleClasseAvg: number;
}

export interface BulletinDomaineDTO {
  domaineId: number;
  domaineName: string;
  domaineNameAr: string | null;
  ordre: number;
  modules: BulletinModuleDTO[];
  moyenneDomaine: number;
  recommandation: string | null;
}

export interface BulletinDTO {
  studentId: number;
  studentName: string;
  studentNameAr: string | null;
  classe: string;
  niveau: string;
  trimestre: number;
  version: string;
  domaines: BulletinDomaineDTO[];
  modulesHorsDomaine: BulletinModuleDTO[];
  moyenneGenerale: number;
  moyenneClasse: number;
  moyenneMin: number;
  moyenneMax: number;
  rang: number;
  totalEleves: number;
  certificatType: string | null;
  comportement: string | null;
}

const BASE = "/bulletins";

export const bulletinsApi = {
  getAll: async (
    classeId: number,
    trimestre: number,
    version: string = "etatique"
  ): Promise<BulletinDTO[]> => {
    const res = await api.get<BulletinDTO[]>(
      `${BASE}?classeId=${classeId}&trimestre=${trimestre}&version=${version}`
    );
    return res.data;
  },

  getOne: async (
    classeId: number,
    studentId: number,
    trimestre: number,
    version: string = "etatique"
  ): Promise<BulletinDTO> => {
    const res = await api.get<BulletinDTO>(
      `${BASE}/student/${studentId}?classeId=${classeId}&trimestre=${trimestre}&version=${version}`
    );
    return res.data;
  },
};
