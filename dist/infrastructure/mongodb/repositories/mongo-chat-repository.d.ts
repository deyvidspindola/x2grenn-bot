import { MongoDb } from '../mongodb';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
export declare class MongoChatRepository implements ChatRepository {
    private readonly mongoDb;
    constructor(mongoDb: MongoDb);
    collectionName: string;
    client: any;
    database: string;
    init(database: string): Promise<void>;
    save(chat: Chat): Promise<void>;
    remove(chatId: number): Promise<void>;
    chats(): Promise<Chat[]>;
    exists(chatId: number): Promise<boolean>;
    cacheChats(): Promise<any>;
}
