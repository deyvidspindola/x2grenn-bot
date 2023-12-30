import { Inject } from 'typescript-ioc';
import { TelegramClient } from '../telegram-client';
import { sendMessage } from '../../../domain/entities/message';
import { SendMessage } from '../../../domain/send-message';

export class TelegramSendMessage extends SendMessage {
  constructor(
    @Inject
    private readonly telegramClient: TelegramClient,
  ) {
    super();
  }

  async execute(message: sendMessage): Promise<void> {
    await this.telegramClient.sendMessage(message.chatId, message.message);
  }
}
