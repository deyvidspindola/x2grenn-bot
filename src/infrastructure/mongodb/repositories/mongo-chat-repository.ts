import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
import { ChatStatus } from '../../../domain/entities/enums/chat-status';
import { Configurations } from '../../configuration/configurations';

export class MongoChatRepository extends ChatRepository {
  constructor(
    @Inject
    private readonly mongoDb: MongoDb,
    @Inject
    private readonly configuration: Configurations,
  ) {
    super();
  }

  async save(chat: Chat) {
    const client = await this.mongoDb.getClient();
    const collection = client.db(this.configuration.mongoDbDatabase).collection('chats');
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
  async remove(chatId: number) {
    const client = await this.mongoDb.getClient();
    const collection = client.db(this.configuration.mongoDbDatabase).collection('chats');
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
  async chats(): Promise<Chat[]> {
    const client = await this.mongoDb.getClient();
    const collection = client.db(this.configuration.mongoDbDatabase).collection('chats');
    const documents = await collection.find().toArray();
    return documents.map((doc) => doc as unknown as Chat).filter((doc) => doc.status === ChatStatus.ACTIVE);
  }

  async exists(chatId: number): Promise<boolean> {
    const chats = await this.chats();
    return chats.some((chat) => chat.chatId === chatId && chat.status === ChatStatus.ACTIVE);
  }
}
