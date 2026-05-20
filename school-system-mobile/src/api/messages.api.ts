import api from "./axios";

export const messagesApi = {
  getInbox: (recipientId: string): Promise<any[]> =>
    api.get(`/messages/inbox/${recipientId}`),

  getSent: (senderId: string): Promise<any[]> =>
    api.get(`/messages/sent/${senderId}`),

  getById: (id: string): Promise<any> =>
    api.get(`/messages/${id}`),

  send: (data: {
    senderId: string;
    recipientIds: string[];
    subject: string;
    body: string;
    type?: "MESSAGE" | "CIRCULAIRE";
  }): Promise<any> =>
    api.post("/messages", { type: "MESSAGE", ...data }),

  markAsRead: (messageId: string, recipientId: string): Promise<void> =>
    api.put(`/messages/${messageId}/read/${recipientId}`),
};
