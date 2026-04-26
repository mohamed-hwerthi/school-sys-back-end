import api from "./axios";

export type NotifChannel = "SMS" | "EMAIL";
export type NotifStatus = "PENDING" | "SENT" | "FAILED" | "SKIPPED";
export type NotifEvent =
  | "NOTE_PUBLIEE"
  | "ABSENCE_NON_JUSTIFIEE"
  | "PAIEMENT_RETARD"
  | "BULLETIN_DISPONIBLE"
  | "CONVOCATION"
  | "SANCTION_DISCIPLINE"
  | "MANUAL";

export interface NotificationLog {
  id: number;
  recipientType: "PARENT" | "TEACHER" | "STUDENT" | "ADMIN";
  recipientId: number | null;
  recipientAddress: string;
  channel: NotifChannel | "PUSH";
  eventType: NotifEvent;
  subject: string | null;
  body: string;
  status: NotifStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
  relatedEntityType: string | null;
  relatedEntityId: number | null;
  triggeredByUserId: number | null;
  retryCount: number;
  createdAt: string;
  sentAt: string | null;
}

export interface SendRequest {
  channels: NotifChannel[];
  triggeredByUserId?: number;
}

export interface ManualSendRequest extends SendRequest {
  message: string;
}

const BASE = "/parent-notifications";

export const parentNotificationsApi = {
  notifyForNote: async (noteId: number, body: SendRequest): Promise<NotificationLog[]> => {
    const res = await api.post(`${BASE}/note/${noteId}`, body);
    return res.data.data;
  },

  notifyForExamen: async (examenId: number, body: SendRequest): Promise<number> => {
    const res = await api.post(`${BASE}/examen/${examenId}`, body);
    return res.data.data;
  },

  notifyManual: async (studentId: number, body: ManualSendRequest): Promise<NotificationLog[]> => {
    const res = await api.post(`${BASE}/manual/${studentId}`, body);
    return res.data.data;
  },

  listLogs: async (params: {
    recipientId?: number;
    eventType?: NotifEvent;
    status?: NotifStatus;
    page?: number;
    size?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    if (params.recipientId) qs.set("recipientId", String(params.recipientId));
    if (params.eventType) qs.set("eventType", params.eventType);
    if (params.status) qs.set("status", params.status);
    qs.set("page", String(params.page ?? 0));
    qs.set("size", String(params.size ?? 20));
    const res = await api.get(`${BASE}/logs?${qs.toString()}`);
    return res.data.data as {
      content: NotificationLog[];
      totalElements: number;
      totalPages: number;
      number: number;
    };
  },
};
