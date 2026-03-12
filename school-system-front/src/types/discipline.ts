export type GraviteType = 'LEGERE' | 'MOYENNE' | 'GRAVE' | 'TRES_GRAVE';

export type TypeIncident =
  | 'BAGARRE'
  | 'INSOLENCE'
  | 'VANDALISME'
  | 'TRICHERIE'
  | 'RETARD_REPETE'
  | 'ABSENCE_INJUSTIFIEE'
  | 'AUTRE';

export type TypeSanction =
  | 'AVERTISSEMENT'
  | 'BLAME'
  | 'EXCLUSION_TEMPORAIRE'
  | 'EXCLUSION_DEFINITIVE'
  | 'TRAVAIL_SUPPLEMENTAIRE'
  | 'CONVOCATION_PARENT';

export type StatutSanction = 'ACTIVE' | 'LEVEE' | 'EXPIREE';

export interface Incident {
  id: number;
  dateIncident: string;
  typeIncident: TypeIncident;
  description?: string;
  gravite: GraviteType;
  enseignantId?: number;
  elevesIds: number[];
  createdAt: string;
}

export interface Sanction {
  id: number;
  incidentId?: number;
  eleveId: number;
  eleveNom?: string;
  typeSanction: TypeSanction;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  notifieParent: boolean;
  niveau: number;
  statut: StatutSanction;
  approuvePar?: number;
  commentaireApprobation?: string;
  createdAt: string;
}

export interface SanctionSuggestion {
  eleveId: number;
  currentMaxNiveau: number;
  suggestedNiveau: number;
  suggestedType: TypeSanction;
  requiresApproval: boolean;
  activeSanctionsCount: number;
}

export interface EvenementDisciplinaire {
  date: string;
  type: 'INCIDENT' | 'SANCTION';
  description: string;
  gravite?: string;
  niveau?: number;
  statut?: string;
  id: number;
}

export interface DossierDisciplinaire {
  eleveId: number;
  eleveNom?: string;
  totalIncidents: number;
  totalSanctions: number;
  niveauActuel: number;
  timeline: EvenementDisciplinaire[];
}
