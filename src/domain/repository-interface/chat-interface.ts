import { Chat } from '../entities/chat';

export interface ChatInterface {
  save(chat: Chat, database: string): Promise<any>;
  remove(chatId: number, database: string): Promise<any>;
  chats(database: string): Promise<Chat[]>;
  exists(chatId: number, database: string): Promise<boolean>;
}
