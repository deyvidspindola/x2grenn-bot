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
import { _endDate, _startDate, _today, _todayNow, calcDiff, extrairNumero, formatTeam } from '../utils';
import moment from 'moment';

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

    schedule('*/5 * * * * *', async () => {
      await this.editMessage();
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
      let msg: any;
      try {
        msg = await this.botDiffGolsRepository.sendMessage({
          chatId: chat.chatId.toString(),
          message,
        });
      } catch (error) {
        continue;
      }
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

  private async editMessage() {
    const filter = {
      startDate: _startDate(_today()),
      endDate: _endDate(_today()),
    };
    const messages = await this.message.messages({ ...filter, edited: false });
    for (const msg of messages) {
      const messageId = JSON.parse(msg.messageId);
      const chatId = JSON.parse(msg.chatId);
      const bet = await this.betRepository.bets({ ...filter, betId: msg.betId.toString() });
      if (!bet.length) continue;
      console.log(
        `${msg.betId}|${moment().diff(moment(bet[0].updatedAt), 'seconds')}|${
          moment().diff(moment(bet[0].updatedAt), 'seconds') > 10801
        }`,
      );
      if (moment().diff(moment(bet[0].updatedAt), 'seconds') > 10801) {
        const result = JSON.parse(bet[0].bet);
        const diff = calcDiff(result.ss);
        const home = formatTeam(result.home.name);
        const away = formatTeam(result.away.name);

        let message = msg.message;
        message =
          message +
          `
        ------------------------------------
        <b>** FIM DE JOGO **</b>
        ${home} <b>${result.ss}</b> ${away}
        <b>Diferença de gols</b>: ${diff}
        `;
        for (let i = 0; i < messageId.length; i++) {
          await this.botDiffGolsRepository.editMessage({
            chatId: chatId[i],
            messageId: messageId[i],
            message: message.replace(/^\s+/gm, ''),
          });
        }
        await this.message.update(msg._id);
      }
    }
  }
}
