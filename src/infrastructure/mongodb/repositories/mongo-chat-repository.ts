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
  async save(chat: Chat) {
    return await this.mongoDb.saveChat(chat);
  }
  async remove(chatId: number) {
    await this.mongoDb.removeChat(chatId);
  }
  async chats(): Promise<Chat[]> {
    return await this.mongoDb.chats();
  }
  async exists(chatId: number): Promise<boolean> {
    const chats = await this.mongoDb.chats();
    return chats.some((chat) => chat.chatId === chatId && chat.status === ChatStatus.ACTIVE);
  }
}
