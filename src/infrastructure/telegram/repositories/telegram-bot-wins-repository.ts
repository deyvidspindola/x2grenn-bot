import { Container, Factory, Inject, ObjectFactory } from 'typescript-ioc';
import { editMessage, sendMessage } from '../../../domain/entities/message';
import { Bot } from 'grammy';
import { ChatStatus } from '../../../domain/entities/enums/chat-status';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
import { Configurations } from '../../configuration/configurations';
import { BotWinsRepository } from '../../../domain/bots/repository/bot-wins-repository';
import { _todayNow } from '../../../application/utils';

export const repositoryRegisterStoryFactory: ObjectFactory = () => {
  const config = Container.get(Configurations);
  const telegramClient = new Bot(config.telegramBotWinsToken);
  return new TelegramBotWinsRepository(telegramClient, config);
};

@Factory(repositoryRegisterStoryFactory)
export class TelegramBotWinsRepository implements BotWinsRepository {
  private chat: any;
  constructor(
    @Inject
    private client: Bot,
    @Inject
    private config: Configurations,
  ) {
    this.client;
    this.config;
    this.chat = Container.get(ChatRepository);
    this.chat.init(this.config.mongoDbWinsDatabase);
  }

  async start() {
    this.client.start();
    await this.subscribe();
    await this.unsubscribe();
    console.log('Conectado ao BOT Diff Gols');
  }

  async sendMessage(message: sendMessage): Promise<any> {
    return await this.client.api.sendMessage(message.chatId, message.message, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      protect_content: true,
    });
  }

  async editMessage(message: editMessage): Promise<any> {
    console.log('entou aqui');
    await this.client.api.editMessageText(message.chatId, Number(message.messageId), message.message, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
    });
  }

  async subscribe() {
    this.client.command('start', async (ctx) => {
      const chatId = ctx.chat?.id;
      const firstName = ctx.from?.first_name;
      const lastName = ctx.from?.last_name;
      const name = `<b>${firstName} ${lastName}</b>`;
      if (await this.chat.exists(chatId)) {
        this.sendMessage({
          chatId: chatId.toString(),
          message: `Olá, ${name}! Você já está cadastrado!\nPara sair digite /sair`,
        });
        return;
      }
      const message = `Olá ${name} seja bem vindo!\nPara sair digite /sair`;
      const data: Chat = {
        firstName,
        lastName,
        chatId,
        createdAt: _todayNow(),
        updatedAt: _todayNow(),
        status: ChatStatus.ACTIVE,
      };
      this.chat.save(data);
      this.sendMessage({ chatId: chatId.toString(), message });
    });
  }

  async unsubscribe() {
    this.client.command('sair', async (ctx) => {
      const chatId = ctx.chat?.id;
      const firstName = ctx.from?.first_name;
      const lastName = ctx.from?.last_name;
      const name = `<b>${firstName} ${lastName}</b>`;
      if (!(await this.chat.exists(chatId))) {
        this.sendMessage({
          chatId: chatId.toString(),
          message: `Olá, ${name}! Você não está cadastrado!\nPara se cadastrar digite /start`,
        });
        return;
      }
      const message = `Olá ${name}, que pena que você está saindo.\nPara se cadastrar digite /start`;
      this.chat.remove(chatId);
      this.sendMessage({ chatId: chatId.toString(), message });
    });
  }
}
