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
import { _todayNow, calcDiff, extrairNumero, formatTeam } from '../utils';

let send = [];
const diffs = {
  8: 3,
  10: 4,
  12: 4,
};
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
  ) {
    this.chat.init(this.configuration.mongoDbDiffGolsDatabase);
    this.message.init(this.configuration.mongoDbDiffGolsDatabase);
    this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
    this.requests.setApiKey(this.configuration.betBotDiffGolsApiKey);
  }

  public async execute() {
    await this.botDiffGolsRepository.start();
    await this.botDiffGolsRepository.sendMessage({
      chatId: this.configuration.telegramDefaultChatId,
      message: 'Bot Diff Gols is running',
    });
    schedule('*/1 * * * * *', async () => {
      await this.process();
    });
  }

  private async process() {
    try {
      const chats = await this.chat.chats();
      if (!chats.length) return;
      const bets = await this.requests.execute('Esoccer');
      this.sendMessageDiffGols(bets, chats);
      this.saveBets(bets);
    } catch (error) {
      console.log(error);
    }
  }

  private sendMessageDiffGols = async (bets: any, chats: Chat[]) => {
    for (const bet of bets) {
      if (bet && bet.ss && bet.time_status == 1) {
        const numeroExtraido = extrairNumero(bet.league.name);
        const diff = calcDiff(bet.ss);
        if (diff >= diffs[numeroExtraido] && !send.includes(bet.id)) {
          const league = `<b>${bet.league.name}</b>`;
          const home = formatTeam(bet.home.name);
          const away = formatTeam(bet.away.name);
          const title = `${home} <b>${bet.ss}</b> ${away}`;
          const message = `${league}\n${title}\n<b>Diferença de gols</b>: ${diff}\n${this.configuration.betUrl}${bet.ev_id}`;
          this.sendMessage(message, chats, bet);
          send.push(bet.id);
        }
      }
    }
  };

  private async sendMessage(message: string, chats: Chat[], bet: any) {
    let msgId: any[] = [];
    let chatId = [];
    for (const chat of chats) {
      const msg = await this.botDiffGolsRepository.sendMessage({
        chatId: chat.chatId.toString(),
        message,
      });
      msgId.push(msg.message_id);
      chatId.push(chat.chatId);
    }
    await this.message.save({
      messageId: JSON.stringify(msgId),
      chatId: JSON.stringify(chatId),
      betId: bet.id,
      eventId: bet.ev_id,
      message: message,
      createdAt: _todayNow(),
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
