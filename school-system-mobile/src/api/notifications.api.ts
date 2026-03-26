import api from "./axios";

export const notificationsApi = {
  getAll: (): Promise<any[]> =>
    api.get("/notifications"),

  getUnreadCount: (): Promise<number> =>
    api.get("/notifications/count"),

  markAsRead: (id: number): Promise<void> =>
    api.put(`/notifications/${id}/read`),

  markAllRead: (): Promise<void> =>
    api.put("/notifications/read-all"),

  delete: (id: number): Promise<void> =>
    api.delete(`/notifications/${id}`),
};
