export type TypeEvaluation = "Contrôle continu" | "Examen trimestriel" | "Examen semestriel" | "Devoir surveillé" | "Oral";

export type StatutEvaluation = "Planifiée" | "En cours" | "Terminée" | "Annulée";

export type Evaluation = {
  id: number;
  titre: string;
  type: TypeEvaluation;
  matiere: string;
  niveau: string;
  classe: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  coefficient: number;
  bareme: number;
  statut: StatutEvaluation;
  enseignant: string;
  salle: string;
  notes: string;
};

export type ResultatEvaluation = {
  id: number;
  evaluationId: number;
  eleveId: number;
  note: number;
  remarque: string;
};

export const TYPES_EVALUATION: TypeEvaluation[] = [
  "Contrôle continu",
  "Examen trimestriel",
  "Examen semestriel",
  "Devoir surveillé",
  "Oral",
];

export const STATUTS_EVALUATION: StatutEvaluation[] = [
  "Planifiée",
  "En cours",
  "Terminée",
  "Annulée",
];

export const MATIERES = [
  "Mathématiques",
  "Français",
  "Arabe",
  "Sciences",
  "Histoire-Géo",
  "Éducation Islamique",
  "Éducation Physique",
  "Anglais",
  "Informatique",
  "Arts Plastiques",
];
