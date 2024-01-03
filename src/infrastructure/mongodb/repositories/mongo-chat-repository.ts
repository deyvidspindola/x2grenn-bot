import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
import { ChatStatus } from '../../../domain/entities/enums/chat-status';

export class MongoChatRepository extends ChatRepository {
  constructor(
    @Inject
    private readonly mongoDb: MongoDb,
  ) {
    super();
  }

  async save(chat: Chat, database: string) {
    const client = await this.mongoDb.getClient();
    const collection = client.db(database).collection('chatId');
    const document = await collection.findOne({ chatId: chat.chatId });
    if (document) {
      await collection.updateOne(
        { chatId: chat.chatId },
        {
          $set: {
            status: chat.status,
            updatedAt: new Date(),
            deletedAt: null,
          },
        },
      );
      return;
    }
    await collection.insertOne(chat);
  }
  async remove(chatId: number, database: string) {
    const client = await this.mongoDb.getClient();
    const collection = client.db(database).collection('chatId');
    await collection.updateOne(
      { chatId },
      {
        $set: {
          status: ChatStatus.INACTIVE,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );
  }
  async chats(database: string): Promise<Chat[]> {
    const client = await this.mongoDb.getClient();
    const collection = client.db(database).collection('chatId');
    const documents = await collection.find().toArray();
    return documents.map((doc) => doc as unknown as Chat).filter((doc) => doc.status === ChatStatus.ACTIVE);
  }

  async exists(chatId: number, database: string): Promise<boolean> {
    const chats = await this.chats(database);
    return chats.some((chat) => chat.chatId === chatId && chat.status === ChatStatus.ACTIVE);
  }
}
