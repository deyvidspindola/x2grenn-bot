import { Chat } from './entities/chat';
import { ChatInterface } from './repository-interface/chat-interface';

export abstract class ChatRepository implements ChatInterface {
  abstract save(chat: Chat, database: string): Promise<any>;
  abstract remove(chatId: number, database: string): Promise<any>;
  abstract chats(database: string): Promise<Chat[]>;
  abstract exists(chatId: number, database: string): Promise<boolean>;
}
