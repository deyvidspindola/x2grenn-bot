import { Inject } from 'typescript-ioc';
import { TelegramClient } from '../telegram-client';
import { sendMessage } from '../../../domain/entities/message';
import { MessageRepository } from '../../../domain/message-repository';

export class TelegramMessageRepository extends MessageRepository {
  constructor(
    @Inject
    private readonly telegramClient: TelegramClient,
  ) {
    super();
  }
  async sendMessage(message: sendMessage): Promise<any> {
    await this.telegramClient.sendMessage(message.chatId, message.message);
  }
}
