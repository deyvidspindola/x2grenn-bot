import { Inject } from 'typescript-ioc';

import { MessageRepository } from '../domain/message-repository';
import { ChatRepository } from '../domain/chat-repository';

export class Bot {
  constructor(
    @Inject
    private readonly message: MessageRepository,
    @Inject
    private readonly chat: ChatRepository,
  ) {}

  public async execute() {
    try {
      const chats = await this.chat.chats();
      for (const chat of chats) {
        await this.message.sendMessage({
          chatId: chat.chatId.toString(),
          message: `Hello, ${chat.firstName}!`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
