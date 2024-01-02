import { MongoClient } from 'mongodb';
import { ObjectFactory } from 'typescript-ioc';
import { Chat } from '../../domain/entities/chat';
export declare const repositoryRegisterStoryFactory: ObjectFactory;
export declare class MongoDb {
    private client;
    private database;
    constructor(client: MongoClient, database: string);
    connect(): Promise<void>;
    saveChat(chat: Chat): Promise<void>;
    removeChat(chatId: number): Promise<void>;
    chats(): Promise<Chat[]>;
}
