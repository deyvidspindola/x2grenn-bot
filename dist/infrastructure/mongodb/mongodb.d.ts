import { MongoClient } from 'mongodb';
import { ObjectFactory } from 'typescript-ioc';
export declare const repositoryRegisterStoryFactory: ObjectFactory;
export declare class MongoDb {
    private client;
    constructor(client: MongoClient);
    connect(): Promise<void>;
    getClient(): Promise<MongoClient>;
}
