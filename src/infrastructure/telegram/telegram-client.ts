import { Bot } from 'grammy';
import { Container, Factory, Inject, ObjectFactory } from 'typescript-ioc';
import { Configurations } from '../configuration/configurations';
import { Chat } from '../../domain/entities/chat';
import { ChatStatus } from '../../domain/entities/enums/chat-status';
import { ChatRepository } from '../../domain/chat-repository';

export const repositoryRegisterStoryFactory: ObjectFactory = () => {
  const config = Container.get(Configurations);
  const telegramClient = new Bot(config.telegramToken);
  return new TelegramClient(telegramClient);
};

@Factory(repositoryRegisterStoryFactory)
export class TelegramClient {
  private chat: any;
  constructor(@Inject private client: Bot) {
    this.client;
    this.chat = Container.get(ChatRepository);
  }

  async start() {
    this.client.start();
    await this.subscribe();
    await this.unsubscribe();
    console.log('Conectado ao Telegram');
  }

  async sendMessage(chatId: string, message: string) {
    await this.client.api.sendMessage(chatId, message);
  }

  async subscribe() {
    this.client.command('start', async (ctx) => {
      const chatId = ctx.chat?.id;
      if (await this.chat.exists(chatId)) {
        this.sendMessage(
          chatId.toString(),
          `Olá, ${ctx.from?.first_name}! Você já está cadastrado no bot\nPara sair digite /sair`,
        );
        return;
      }
      const firstName = ctx.from?.first_name;
      const lastName = ctx.from?.last_name;
      const message = `Olá ${firstName} ${lastName} seja bem vindo ao bot\nPara sair digite /sair`;
      const data: Chat = {
        firstName,
        lastName,
        chatId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: ChatStatus.ACTIVE,
      };
      this.chat.save(data);
      this.sendMessage(chatId.toString(), message);
    });
  }

  async unsubscribe() {
    this.client.command('sair', async (ctx) => {
      const chatId = ctx.chat?.id;
      if (!(await this.chat.exists(chatId))) {
        this.sendMessage(
          chatId.toString(),
          `Olá, ${ctx.from?.first_name}! Você não está cadastrado no bot\nPara se cadastrar digite /start`,
        );
        return;
      }
      const firstName = ctx.from?.first_name;
      const lastName = ctx.from?.last_name;
      const message = `Olá ${firstName} ${lastName}, que pena que você está saindo do bot\nPara se cadastrar digite /start`;
      this.chat.remove(chatId);
      this.sendMessage(chatId.toString(), message);
    });
  }
}
