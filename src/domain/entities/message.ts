export interface Messages {
  messageId: string;
  chatId: string;
  betId: number;
  eventId: number;
  message: string;
  createdAt: Date;
}

export interface GetMessage {
  betId: number;
}

export interface sendMessage {
  chatId: string;
  message: string;
}
