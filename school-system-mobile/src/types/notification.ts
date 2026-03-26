export type NotificationType = 'INFO' | 'WARNING' | 'ALERT' | 'FINANCE' | 'ABSENCE' | 'NOTE' | 'DISCIPLINE';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export type AnnonceType = 'GENERAL' | 'URGENT' | 'EVENEMENT' | 'REUNION';
export type DestinatairesType = 'TOUS' | 'PARENTS' | 'ENSEIGNANTS' | 'ELEVES' | 'CLASSE';

export interface Annonce {
  id: number;
  titre: string;
  contenu: string;
  type: AnnonceType;
  destinataires: DestinatairesType;
  classeId?: number;
  auteurId?: number;
  auteurName?: string;
  datePublication: string;
  dateExpiration?: string;
  actif: boolean;
  createdAt: string;
}

export interface Child {
  id: number;
  firstName: string;
  lastName: string;
  classe: string;
  niveau: string;
  matricule?: string;
}
