import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Messages } from '../../../domain/entities/message';
import { MessageRepository } from '../../../domain/message-repository';

export class MongoMessageRepository extends MessageRepository {
  constructor(
    @Inject
    private readonly mongoDb: MongoDb,
  ) {
    super();
  }

  async save(message: Messages, database: string) {
    const client = await this.mongoDb.getClient();
    const collection = client.db(database).collection('messages');
    await collection.insertOne(message);
  }

  async messages(database: string): Promise<Messages[]> {
    const client = await this.mongoDb.getClient();
    const collection = client.db(database).collection('messages');
    const documents = await collection.find().toArray();
    return documents.map((doc) => doc as unknown as Messages);
  }

  async removeMessages(database: string) {
    const client = await this.mongoDb.getClient();
    const collection = client.db(database).collection('messages');
    await collection.deleteMany({});
  }
}
