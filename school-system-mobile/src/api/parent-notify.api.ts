import api from "./axios";

/** Delivery channels supported by the backend `ParentNotificationController`. */
export type NotifyChannel = "SMS" | "EMAIL" | "PUSH";

export interface NotifyParentBody {
  message: string;
  channels: NotifyChannel[];
  triggeredByUserId?: string;
}

export const parentNotifyApi = {
  /**
   * Sends a manual message to a student's parents.
   * Note: actual delivery depends on backend channel config (SMS is a stub,
   * email is disabled in dev) — see docs/NOTIFICATION-BACKLOG.md.
   */
  notifyParent: (studentId: string, body: NotifyParentBody): Promise<unknown> =>
    api.post(`/parent-notifications/manual/${studentId}`, body),
};
