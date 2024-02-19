import { MongoDb } from '../mongodb';
import { Messages } from '../../../domain/entities/message';
import { MessageRepository } from '../../../domain/message-repository';
export declare class MongoMessageRepository implements MessageRepository {
    private readonly mongoDb;
    constructor(mongoDb: MongoDb);
    collectionName: string;
    client: any;
    database: string;
    init(database: string): Promise<void>;
    save(message: Messages): Promise<void>;
    update(message_id: string): Promise<void>;
    messages(filters?: any): Promise<Messages[]>;
    removeMessages(): Promise<void>;
    cacheMessages(filters?: any): Promise<any>;
}
