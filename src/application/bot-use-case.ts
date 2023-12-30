import { Inject } from 'typescript-ioc';
import { SendMessage } from '../domain/send-message';
import { Configurations } from '../infrastructure/configuration/configurations';

export class Bot {
  constructor(
    @Inject
    private readonly sendMessage: SendMessage,
    @Inject
    private readonly config: Configurations,
  ) {}

  public async execute() {
    try {
      await this.sendMessage.execute({
        chatId: this.config.telegramDefaultChatId,
        message: 'Hello World',
      });
      console.log('Executando bot');
    } catch (error) {
      console.log(error);
    }
  }
}
