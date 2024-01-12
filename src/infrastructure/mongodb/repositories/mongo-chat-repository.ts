import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
import { ChatStatus } from '../../../domain/entities/enums/chat-status';
import { _todayNow } from '../../../application/utils';
import * as memoryCache from 'memory-cache';

export class MongoChatRepository implements ChatRepository {
  constructor(
    @Inject
    private readonly mongoDb: MongoDb,
  ) {}

  collectionName = 'chats';
  client: any;
  database: string;

  async init(database: string) {
    this.client = await this.mongoDb.getClient();
    this.database = database;
  }

  async save(chat: Chat) {
    const collection = this.client.db(this.database).collection(this.collectionName);
    const document = await collection.findOne({ chatId: chat.chatId });
    if (document) {
      await collection.updateOne(
        { chatId: chat.chatId },
        {
          $set: {
            status: chat.status,
            updatedAt: _todayNow(),
            deletedAt: null,
          },
        },
      );
      return;
    }
    await collection.insertOne(chat);
  }

  async remove(chatId: number) {
    const collection = this.client.db(this.database).collection(this.collectionName);
    await collection.updateOne(
      { chatId },
      {
        $set: {
          status: ChatStatus.INACTIVE,
          deletedAt: _todayNow(),
          updatedAt: _todayNow(),
        },
      },
    );
  }

  async chats(): Promise<Chat[]> {
    const collection = this.client.db(this.database).collection(this.collectionName);
    const documents = await collection.find().toArray();
    return documents
      .map((doc: unknown) => doc as unknown as Chat)
      .filter((doc: { status: ChatStatus }) => doc.status === ChatStatus.ACTIVE);
  }

  async exists(chatId: number): Promise<boolean> {
    const chats = await this.chats();
    return chats.some((chat) => chat.chatId === chatId && chat.status === ChatStatus.ACTIVE);
  }

  async cacheChats() {
    const cacheKey = 'chats';
    const cachedChats = memoryCache.get(cacheKey);
    if (cachedChats) {
      return cachedChats;
    }
    const chats = await this.chats();
    memoryCache.put(cacheKey, chats, 60000);
    return chats;
  }
}
