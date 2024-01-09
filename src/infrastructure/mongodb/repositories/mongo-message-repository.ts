import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Messages } from '../../../domain/entities/message';
import { MessageRepository } from '../../../domain/message-repository';

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
    }
    const documents: any[] = await collection.find(query).toArray();
    return documents.map((doc: any) => doc as Messages);
  }

  async removeMessages() {
    const collection = this.client.db(this.database).collection(this.collectionName);
    await collection.deleteMany({});
  }
}
