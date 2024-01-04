import { Chat } from './entities/chat';
import { ChatInterface } from './repository-interface/chat-interface';

export abstract class ChatRepository implements ChatInterface {
  abstract init(database: string): Promise<any>;
  abstract save(chat: Chat): Promise<any>;
  abstract remove(chatId: number): Promise<any>;
  abstract chats(): Promise<Chat[]>;
  abstract exists(chatId: number): Promise<boolean>;
}
