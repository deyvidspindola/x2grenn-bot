import { Chat } from '../entities/chat';

export interface ChatInterface {
  save(chat: Chat): Promise<any>;
  remove(chatId: number): Promise<any>;
  chats(): Promise<Chat[]>;
  exists(chatId: number): Promise<boolean>;
}
