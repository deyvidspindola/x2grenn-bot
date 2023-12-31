import { MongoClient } from 'mongodb';
import { Container, Factory, Inject, ObjectFactory } from 'typescript-ioc';
import { Configurations } from '../configuration/configurations';
import { Chat } from '../../domain/entities/chat';
import { ChatStatus } from '../../domain/entities/enums/chat-status';

export const repositoryRegisterStoryFactory: ObjectFactory = () => {
  const config = Container.get(Configurations);
  const mongoDb = new MongoClient(
    `${config.mongoDbDriver}://${config.mongoDbUsename}:${config.mongoDbPassword}@${config.mongoDbUri}/?retryWrites=true&w=majority`,
  );
  return new MongoDb(mongoDb, config.mongoDbDatabase);
};

@Factory(repositoryRegisterStoryFactory)
export class MongoDb {
  constructor(@Inject private client: MongoClient, private database: string) {
    this.database;
  }

  async connect() {
    await this.client.connect();
    console.log('Conectado ao MongoDB');
  }

  async saveChat(chat: Chat) {
    const collection = this.client.db(this.database).collection('chats');
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

  async removeChat(chatId: number) {
    const collection = this.client.db(this.database).collection('chats');
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
    const collection = this.client.db(this.database).collection('chats');
    const documents = await collection.find().toArray();
    return documents.map((doc) => doc as unknown as Chat).filter((doc) => doc.status === ChatStatus.ACTIVE);
  }
}
