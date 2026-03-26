export type AbsenceType = 'ABSENCE' | 'RETARD';
export type AlertLevel = 'NORMAL' | 'JAUNE' | 'ROUGE';

export interface Absence {
  id: number;
  eleveId: number;
  eleveNom?: string;
  elevePrenom?: string;
  date: string;
  type: AbsenceType;
  seance: string;
  heureArrivee?: string;
  justifie: boolean;
  motif?: string;
  enseignantId?: number;
  createdAt: string;
}

export interface AbsenceBatchItem {
  eleveId: number;
  type: AbsenceType;
  seance: string;
  heureArrivee?: string;
}

export interface AbsenceBatchRequest {
  date: string;
  classeId: number;
  enseignantId?: number;
  absences: AbsenceBatchItem[];
}

export interface EleveAlert {
  eleveId: number;
  nom: string;
  prenom: string;
  absences: number;
  alertLevel: AlertLevel;
}

export interface AbsenceStats {
  totalAbsences: number;
  totalRetards: number;
  tauxPresence: number;
  alertLevel?: AlertLevel;
  elevesEnAlerte?: EleveAlert[];
  parEleve: Array<{
    eleveId: number;
    nom: string;
    prenom: string;
    absences: number;
    retards: number;
  }>;
}

export interface AbsenceSettings {
  id?: number;
  seuilAlerteJaune: number;
  seuilAlerteRouge: number;
  notificationAuto: boolean;
  notificationEmail: boolean;
  notificationSms: boolean;
}

export interface RapportPresence {
  classeLabel: string;
  mois: number;
  annee: number;
  totalEleves: number;
  totalAbsences: number;
  totalRetards: number;
  tauxPresenceGlobal: number;
  eleves: Array<{
    eleveId: number;
    nom: string;
    prenom: string;
    totalAbsences: number;
    totalRetards: number;
    totalJustifiees: number;
    tauxPresence: number;
  }>;
}

export interface MonthlyBreakdown {
  month: number;
  year: number;
  absences: number;
  retards: number;
  justifiees: number;
  tauxPresence: number;
}

export interface RecentAbsence {
  id: number;
  date: string;
  type: AbsenceType;
  seance: string;
  heureArrivee?: string;
  justifie: boolean;
  motif?: string;
}

export interface HistoriquePresence {
  eleveId: number;
  studentName: string;
  totalAbsences: number;
  totalRetards: number;
  totalJustifiees: number;
  tauxPresence: number;
  alertLevel: AlertLevel;
  monthlyBreakdown: MonthlyBreakdown[];
  recentAbsences: RecentAbsence[];
}
