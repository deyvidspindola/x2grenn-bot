import { Container, Factory, Inject, ObjectFactory } from 'typescript-ioc';
import { sendMessage } from '../../../domain/entities/message';
import { Bot } from 'grammy';
import { ChatStatus } from '../../../domain/entities/enums/chat-status';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
import { Configurations } from '../../configuration/configurations';
import { BotDiffGolsRepository } from '../../../domain/bot-diff-gols-repository';

export const repositoryRegisterStoryFactory: ObjectFactory = () => {
  const config = Container.get(Configurations);
  const telegramClient = new Bot(config.telegramBotDiffGolsToken);
  return new TelegramBotDiffGolsRepository(telegramClient, config);
};

@Factory(repositoryRegisterStoryFactory)
export class TelegramBotDiffGolsRepository extends BotDiffGolsRepository {
  private chat: any;
  constructor(
    @Inject
    private client: Bot,
    @Inject
    private config: Configurations,
  ) {
    super();
    this.client;
    this.config;
    this.chat = Container.get(ChatRepository);
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

  async subscribe() {
    this.client.command('start', async (ctx) => {
      const chatId = ctx.chat?.id;
      const firstName = ctx.from?.first_name;
      const lastName = ctx.from?.last_name;
      const name = `<b>${firstName} ${lastName}<b/>`;
      if (await this.hasChat(chatId)) {
        this.sendMessage({
          chatId: chatId.toString(),
          message: `Olá, ${name}! Você já está cadastrado no bot\nPara sair digite /sair`,
        });
        return;
      }
      const message = `Olá ${name} seja bem vindo ao bot\nPara sair digite /sair`;
      const data: Chat = {
        firstName,
        lastName,
        chatId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: ChatStatus.ACTIVE,
      };
      this.chat.save(data, this.config.mongoDbDatabase);
      this.sendMessage({ chatId: chatId.toString(), message });
    });
  }

  async unsubscribe() {
    this.client.command('sair', async (ctx) => {
      const chatId = ctx.chat?.id;
      const firstName = ctx.from?.first_name;
      const lastName = ctx.from?.last_name;
      const name = `<b>${firstName} ${lastName}<b/>`;
      if (!this.hasChat(chatId)) {
        this.sendMessage({
          chatId: chatId.toString(),
          message: `Olá, ${name}! Você não está cadastrado no bot\nPara se cadastrar digite /start`,
        });
        return;
      }
      const message = `Olá ${name}, que pena que você está saindo do bot\nPara se cadastrar digite /start`;
      this.chat.remove(chatId);
      this.sendMessage({ chatId: chatId.toString(), message });
    });
  }

  private async hasChat(chatId: number): Promise<boolean> {
    return await this.chat.exists(chatId, this.config.mongoDbDatabase);
  }
}
