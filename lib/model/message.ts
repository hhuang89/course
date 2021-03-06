import { User } from "./user";

export interface MessageResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export type MessageType = "notification" | "message";

export interface Message {
  createdAt: string;
  id: number;
  content: string;
  status: number;
  from: Omit<User, "email">;
  type: MessageType;
}

export interface MessageStatistics {
  sent: Sent;
  receive: Sent;
}

export interface Sent {
  notification: Notification;
  message: Notification;
}

export interface Notification {
  total: number;
  unread: number;
  read: number;
}
