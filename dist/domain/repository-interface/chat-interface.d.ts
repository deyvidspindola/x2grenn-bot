import { Chat } from '../entities/chat';
export interface ChatInterface {
    init(database: string): Promise<any>;
    save(chat: Chat): Promise<any>;
    remove(chatId: number): Promise<any>;
    chats(): Promise<Chat[]>;
    exists(chatId: number): Promise<boolean>;
}
