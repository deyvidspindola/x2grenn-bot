import { ChatStatus } from './enums/chat-status';

export interface SaveChat {
  firstName: string;
  lastName: string;
  chatId: number;
  createdAt: Date;
  status: ChatStatus;
}

export interface GetChat {
  chatId: number;
}
