export type Message = {
  id: number;
  studentId: number;
  senderRole: "admin" | "parent";
  content: string;
  timestamp: string;
  read: boolean;
};

export type Conversation = {
  studentId: number;
  messages: Message[];
  unreadCount: number;
};
