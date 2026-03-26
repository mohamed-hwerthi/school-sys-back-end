export interface Creneau {
  id: number;
  label: string;
  heureDebut: string;
  heureFin: string;
  type: 'COURS' | 'PAUSE' | 'RECREATION';
}

export interface EmploiDuTempsEntry {
  id?: number;
  classeId: number;
  creneauId: number;
  jourSemaine: number;
  moduleId?: number;
  moduleName?: string;
  enseignantId?: number;
  enseignantNom?: string;
  salle?: string;
}

export interface Conflit {
  typeConflit?: string;
  message: string;
  jourSemaine: number;
  creneauId: number;
  enseignantId?: number;
  salle?: string;
}

export interface RemplacementRequest {
  emploiDuTempsId: number;
  enseignantRemplacantId: number;
  dateDebut: string;
  dateFin: string;
  motif?: string;
}

export interface Remplacement {
  id: number;
  emploiDuTempsId: number;
  enseignantRemplacantId: number;
  dateDebut: string;
  dateFin: string;
  motif?: string;
  createdAt?: string;
}

// --- Auto-generation types ---

export interface TeachingAssignment {
  classeId: number;
  moduleId: number;
  enseignantId: number;
  nbHeures: number;
}

export interface TimetableGenerateRequest {
  assignments: TeachingAssignment[];
  rooms: string[];
  solverTimeoutSeconds?: number;
}

export interface TimetableGenerateResponse {
  status: 'SOLVED' | 'INFEASIBLE';
  score: string;
  entries: EmploiDuTempsEntry[];
  unresolvedConflicts: string[];
}
