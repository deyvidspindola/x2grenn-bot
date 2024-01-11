export interface Messages {
  _id?: string;
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

export interface editMessage {
  chatId: string;
  messageId: string;
  message: string;
}
