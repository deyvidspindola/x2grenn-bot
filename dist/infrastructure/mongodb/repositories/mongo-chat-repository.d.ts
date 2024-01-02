import { MongoDb } from '../mongodb';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
export declare class MongoChatRepository extends ChatRepository {
    private readonly mongoDb;
    constructor(mongoDb: MongoDb);
    save(chat: Chat): Promise<void>;
    remove(chatId: number): Promise<void>;
    chats(): Promise<Chat[]>;
    exists(chatId: number): Promise<boolean>;
}
