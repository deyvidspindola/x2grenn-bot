import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Messages } from '../../../domain/entities/message';
import { MessageRepository } from '../../../domain/message-repository';
import * as memoryCache from 'memory-cache';

export class MongoMessageRepository implements MessageRepository {
  constructor(
    @Inject
    private readonly mongoDb: MongoDb,
  ) {}

  collectionName = 'messages';
  client: any;
  database: string;

  async init(database: string) {
    this.client = await this.mongoDb.getClient();
    this.database = database;
  }

  async save(message: Messages) {
    const collection = this.client.db(this.database).collection(this.collectionName);
    await collection.insertOne(message);
  }

  async update(message_id: string) {
    const collection = this.client.db(this.database).collection(this.collectionName);
    await collection.updateOne(
      { _id: message_id },
      {
        $set: {
          edited: true,
        },
      },
    );
  }

  async messages(filters: any = null): Promise<Messages[]> {
    const collection = this.client.db(this.database).collection(this.collectionName);
    let query = {};
    if (filters !== null) {
      query = {
        createdAt: {
          $gte: filters.startDate,
          $lte: filters.endDate,
        },
      };
      if (filters.edited !== undefined) {
        if ('edited' in query) {
          query.edited = filters.edited;
        } else {
          query = {
            ...query,
            edited: filters.edited,
          };
        }
      }
    }
    const documents: any[] = await collection.find(query).toArray();
    return documents.map((doc: any) => doc as Messages);
  }

  async removeMessages() {
    const collection = this.client.db(this.database).collection(this.collectionName);
    await collection.deleteMany({});
  }

  async cacheMessages(filters: any = null) {
    const cacheKey = 'messages';
    const cachedMessages = memoryCache.get(cacheKey);
    if (cachedMessages) {
      return cachedMessages;
    }
    const messages = await this.messages(filters);
    memoryCache.put(cacheKey, messages, 60000);
    return messages;
  }
}
