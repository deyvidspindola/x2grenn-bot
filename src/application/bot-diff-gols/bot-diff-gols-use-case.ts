import { Inject } from 'typescript-ioc';
import { schedule } from 'node-cron';
import { ChatRepository } from '../../domain/chat-repository';
import { RequestsRepository } from '../../domain/requests-repository';
import { Configurations } from '../../infrastructure/configuration/configurations';
import { Chat } from '../../domain/entities/chat';
import { MessageRepository } from '../../domain/message-repository';
import { Messages } from '../../domain/entities/message';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
import { BetRepository } from '../../domain/bet-repository';
import { _endDate, _startDate, _today, _todayNow, calcDiff, formatTeam } from '../utils';

let send = [];
export class BotDiffGolsUseCase {
  constructor(
    @Inject
    private readonly configuration: Configurations,
    @Inject
    private readonly requests: RequestsRepository,
    @Inject
    private readonly botDiffGolsRepository: BotDiffGolsRepository,
    @Inject
    private readonly chat: ChatRepository,
    @Inject
    private readonly message: MessageRepository,
    @Inject
    private readonly betRepository: BetRepository,
  ) {}

  public async execute() {
    await this.initialize();
    await this.startBot();
  }

  private async initialize() {
    await this.botDiffGolsRepository.start();
    await this.botDiffGolsRepository.sendMessage({
      chatId: this.configuration.telegramDefaultChatId,
      message: 'Bot Diff Gols is running',
    });
    this.initRepositories();
  }

  private initRepositories() {
    this.chat.init(this.configuration.mongoDbDiffGolsDatabase);
    this.message.init(this.configuration.mongoDbDiffGolsDatabase);
    this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
    this.requests.setApiKey(this.configuration.betBotDiffGolsApiKey);
  }

  private async startBot() {
    schedule('*/2 * * * * *', async () => {
      await this.process();
    });

    schedule('0 * * * * *', async () => {
      const lastbets = send.slice(-10);
      send = [];
      send.push(...lastbets);
    });
  }

  private async process() {
    try {
      const chats = await this.chat.cacheChats();
      if (!chats.length) return;
      const bets = await this.requests.execute('Esoccer');
      this.sendMessageDiffGols(bets, chats);
      this.saveBets(bets);
    } catch (error) {
      console.log(error);
    }
  }

  private sendMessageDiffGols = async (bets: any, chats: Chat[]) => {
    await Promise.all(
      bets.map(async (bet: any) => {
        if (this.shouldSendMessage(bet)) {
          await this.sendMessageToChats(chats, bet);
          send.push(bet.id);
        }
      }),
    );
  };

  private shouldSendMessage(bet: any) {
    if (!bet || !bet.ss || bet.time_status != 1) {
      return false;
    }
    const diff = calcDiff(bet.ss, bet.league.name);
    return !send.includes(bet.id) && diff.result;
  }

  private createMessage(bet: any) {
    const league = `<b>${bet.league.name}</b>`;
    const home = formatTeam(bet.home.name);
    const away = formatTeam(bet.away.name);
    const title = `${home} <b>${bet.ss}</b> ${away}`;
    const diff = calcDiff(bet.ss, bet.league.name).diff;
    const message = `${league}\n${title}\n<b>Diferença de gols</b>: ${diff}\n${this.configuration.betUrl}${bet.ev_id}`;
    return message;
  }

  private async sendMessageToChats(chats: Chat[], bet: any) {
    const message = this.createMessage(bet);
    const sentMessages = await Promise.all(
      chats.map(async (chat) => {
        try {
          const msg = await this.botDiffGolsRepository.sendMessage({
            chatId: chat.chatId.toString(),
            message,
          });
          return msg.message_id;
        } catch (error) {
          return null;
        }
      }),
    );

    await this.saveMessages(sentMessages, chats, bet, message);
  }

  private async saveMessages(messageIds: (number | null)[], chats: Chat[], bet: any, message: string) {
    const validMessageIds = messageIds.filter((id) => id !== null) as number[];
    const chatIds = chats.map((chat) => chat.chatId);
    await this.message.save({
      messageId: JSON.stringify(validMessageIds),
      chatId: JSON.stringify(chatIds),
      betId: bet.id,
      eventId: bet.ev_id,
      message: message,
      createdAt: _todayNow(),
      edited: false,
    } as Messages);
  }

  private saveBets(bets: any) {
    for (const bet of bets) {
      this.betRepository.save({
        betId: bet.id,
        bet: JSON.stringify(bet),
        createdAt: _todayNow(),
        updatedAt: _todayNow(),
      });
    }
  }
}
