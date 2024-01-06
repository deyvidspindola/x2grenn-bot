export interface Messages {
  messageId: string;
  chatId: string;
  gameId: number;
  eventId: number;
  message: string;
  createdAt: Date;
}

export interface GetMessage {
  gameId: number;
}

export interface sendMessage {
  chatId: string;
  message: string;
}
