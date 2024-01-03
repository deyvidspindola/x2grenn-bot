import { Container, Factory, Inject, ObjectFactory } from 'typescript-ioc';
import { sendMessage } from '../../../domain/entities/message';
import { Bot } from 'grammy';
import { ChatStatus } from '../../../domain/entities/enums/chat-status';
import { Chat } from '../../../domain/entities/chat';
import { ChatRepository } from '../../../domain/chat-repository';
import { Configurations } from '../../configuration/configurations';
import { BotWinsRepository } from '../../../domain/bot-wins-repository';

export const repositoryRegisterStoryFactory: ObjectFactory = () => {
  const config = Container.get(Configurations);
  const telegramClient = new Bot(config.telegramBotConfigurationToken);
  return new TelegramBotWinsRepository(telegramClient);
};

@Factory(repositoryRegisterStoryFactory)
export class TelegramBotWinsRepository extends BotWinsRepository {
  private chat: any;
  constructor(@Inject private client: Bot) {
    super();
    this.client;
    this.chat = Container.get(ChatRepository);
  }
  async start() {
    this.client.start();
    await this.subscribe();
    await this.unsubscribe();
    await this.configDiffGols();
    await this.pingpong();
    console.log('Conectado ao Telegram');
  }

  async sendMessage(message: sendMessage): Promise<any> {
    await this.client.api.sendMessage(message.chatId, message.message, { parse_mode: 'HTML' });
  }

  async configDiffGols() {
    this.client.on('message:text', async (ctx) => {
      // Text is always defined because this handler is called when a text message is received.
      const text: any = ctx;
      console.log(text);
    });
  }

  async pingpong() {
    this.client.hears('ping', async (ctx) => {
      // `reply` is an alias for `sendMessage` in the same chat (see next section).
      await ctx.reply('pong', {
        // `reply_parameters` specifies the actual reply feature.
        reply_parameters: { message_id: ctx.msg.message_id },
      });
    });
  }

  async subscribe() {
    this.client.command('start', async (ctx) => {
      const chatId = ctx.chat?.id;
      ctx.react('😍');
      if (await this.chat.exists(chatId)) {
        this.sendMessage({
          chatId: chatId.toString(),
          message: `Olá, <b>${ctx.from?.first_name}</b>! Você já está cadastrado no bot\nPara sair digite /sair`,
        });
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
      this.sendMessage({ chatId: chatId.toString(), message });
    });
  }

  async unsubscribe() {
    this.client.command('sair', async (ctx) => {
      const chatId = ctx.chat?.id;
      if (!(await this.chat.exists(chatId))) {
        this.sendMessage({
          chatId: chatId.toString(),
          message: `Olá, ${ctx.from?.first_name}! Você não está cadastrado no bot\nPara se cadastrar digite /start`,
        });
        return;
      }
      const firstName = ctx.from?.first_name;
      const lastName = ctx.from?.last_name;
      const message = `Olá ${firstName} ${lastName}, que pena que você está saindo do bot\nPara se cadastrar digite /start`;
      this.chat.remove(chatId);
      this.sendMessage({ chatId: chatId.toString(), message });
    });
  }
}
