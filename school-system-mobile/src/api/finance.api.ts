import api from "./axios";

/** Mirrors backend `FinanceDashboardDTO`. */
export interface FinanceDashboard {
  totalEncaisse: number;
  totalDu: number;
  totalImpayes: number;
  tauxRecouvrement: number;
  totalPaiements: number;
  paiementsPayes: number;
  paiementsEnRetard: number;
  paiementsPartiels: number;
  paiementsEnAttente: number;
}

export interface CategorieTotal {
  categorieId: string;
  categorieNom: string;
  total: number;
}

/** Mirrors backend `DepenseStatsDTO`. */
export interface DepenseStats {
  totalDepenses: number;
  nombreDepenses: number;
  parCategorie: CategorieTotal[];
}

/** Default current school year — matches the backend default. */
export const CURRENT_SCHOOL_YEAR = "2025-2026";

/** A payment row. Subset of backend `PaiementResponseDTO`. */
export interface PaiementSummary {
  id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  typeFraisNom: string | null;
  mois: string | null;
  anneeScolaire: string | null;
  montantDu: number;
  montantPaye: number;
  datePaiement: string | null;
  modePaiement: string | null;
  statut: string;
  reference: string | null;
}

/** An expense row. Subset of backend `DepenseResponseDTO`. */
export interface DepenseSummary {
  id: string;
  categorieNom: string | null;
  libelle: string;
  montant: number;
  dateDepense: string | null;
  modePaiement: string | null;
  fournisseur: string | null;
  anneeScolaire: string | null;
}

interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const financeApi = {
  /** Finance dashboard (`READ_FINANCE`) — revenues, dues, recovery rate, payment status counts. */
  getDashboard: (anneeScolaire: string = CURRENT_SCHOOL_YEAR): Promise<FinanceDashboard> =>
    api.get("/paiements/dashboard", { params: { anneeScolaire } }),

  /** Expense stats (`READ_FINANCE`) — total + breakdown by category. */
  getDepenseStats: (anneeScolaire: string = CURRENT_SCHOOL_YEAR): Promise<DepenseStats> =>
    api.get("/depenses/stats", { params: { anneeScolaire } }),

  /** Paginated list of payments (`READ_FINANCE`). */
  listPaiements: (params: { page?: number; size?: number } = {}): Promise<PagedResponse<PaiementSummary>> =>
    api.get("/paiements", { params: { page: 0, size: 50, ...params } }),

  /** Paginated list of expenses (`READ_FINANCE`). */
  listDepenses: (params: { page?: number; size?: number } = {}): Promise<PagedResponse<DepenseSummary>> =>
    api.get("/depenses", { params: { page: 0, size: 50, ...params } }),
};
