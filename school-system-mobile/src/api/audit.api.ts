import api from "./axios";

/** One audit log entry. Mirrors backend `AuditLogDTO`. */
export interface AuditLog {
  id: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  timestamp: string;
}

interface AuditPage {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface AuditLogParams {
  page?: number;
  size?: number;
  username?: string;
  action?: string;
  entityType?: string;
}

export const auditApi = {
  /** Paginated audit log (`READ_AUDIT`). */
  getLogs: (params: AuditLogParams = {}): Promise<AuditPage> =>
    api.get("/audit-logs", { params: { size: 50, ...params } }),
};
