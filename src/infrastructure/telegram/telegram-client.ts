import { Bot } from 'grammy';
import { Container, Factory, Inject, ObjectFactory } from 'typescript-ioc';
import { Configurations } from '../configuration/configurations';

export const repositoryRegisterStoryFactory: ObjectFactory = () => {
  const config = Container.get(Configurations);
  const telegramClient = new Bot(config.telegramToken);
  return new TelegramClient(telegramClient);
};

@Factory(repositoryRegisterStoryFactory)
export class TelegramClient {
  constructor(@Inject private client: Bot) {
    this.client;
  }

  async start() {
    this.client.start();
    console.log('Conectado ao Telegram');
  }

  async sendMessage(chatId: string, message: string) {
    await this.client.api.sendMessage(chatId, message);
  }
}
