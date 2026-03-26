export type TypeDevoir = 'DEVOIR' | 'EXERCICE' | 'PROJET' | 'EXPOSE';
export type StatutDevoir = 'BROUILLON' | 'PUBLIE' | 'FERME';
export type TypeRessource = 'DOCUMENT' | 'VIDEO' | 'LIEN' | 'IMAGE' | 'AUDIO';

export interface Devoir {
  id: number;
  titre: string;
  description: string | null;
  moduleId: number | null;
  classeId: number | null;
  enseignantId: number | null;
  datePublication: string;
  dateLimite: string;
  type: TypeDevoir;
  pointsMax: number;
  fichierUrl: string | null;
  statut: StatutDevoir;
  totalSoumissions: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDevoirRequest {
  titre: string;
  description?: string;
  moduleId?: number;
  classeId?: number;
  enseignantId?: number;
  datePublication?: string;
  dateLimite: string;
  type?: TypeDevoir;
  pointsMax?: number;
  fichierUrl?: string;
  statut?: StatutDevoir;
}

export interface Soumission {
  id: number;
  devoirId: number;
  devoirTitre: string;
  eleveId: number;
  contenu: string | null;
  fichierUrl: string | null;
  dateSoumission: string;
  note: number | null;
  commentaireCorrection: string | null;
  corrige: boolean;
  enRetard: boolean;
  createdAt: string;
}

export interface CreateSoumissionRequest {
  devoirId: number;
  eleveId: number;
  contenu?: string;
  fichierUrl?: string;
}

export interface CorrectionRequest {
  note: number;
  commentaire?: string;
}

export interface RessourcePedagogique {
  id: number;
  titre: string;
  description: string | null;
  moduleId: number | null;
  type: TypeRessource;
  fichierUrl: string | null;
  lienExterne: string | null;
  enseignantId: number | null;
  tailleFichier: number | null;
  createdAt: string;
}

export interface CreateRessourceRequest {
  titre: string;
  description?: string;
  moduleId?: number;
  type?: TypeRessource;
  fichierUrl?: string;
  lienExterne?: string;
  enseignantId?: number;
  tailleFichier?: number;
}

export interface DevoirStats {
  totalDevoirs: number;
  totalSoumissions: number;
  tauxSoumission: number;
  moyenneNotes: number;
  enRetard: number;
}
