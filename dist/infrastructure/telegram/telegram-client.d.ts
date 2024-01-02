import { Bot } from 'grammy';
import { ObjectFactory } from 'typescript-ioc';
export declare const repositoryRegisterStoryFactory: ObjectFactory;
export declare class TelegramClient {
    private client;
    private chat;
    constructor(client: Bot);
    start(): Promise<void>;
    sendMessage(chatId: string, message: string): Promise<void>;
    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;
}
