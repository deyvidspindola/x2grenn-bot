import { Inject } from 'typescript-ioc';
import { schedule } from 'node-cron';
import { ChatRepository } from '../../domain/chat-repository';
import { RequestsRepository } from '../../domain/requests-repository';
import { Configurations } from '../../infrastructure/configuration/configurations';
import { MessageRepository } from '../../domain/message-repository';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
import { BetRepository } from '../../domain/bet-repository';
import { _endDate, _startDate, _today, _todayNow, calcDiff, formatTeam } from '../utils';
import moment from 'moment';

export class BotDiffGolsEditMessageUseCase {
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
    schedule('*/5 * * * * *', async () => {
      await this.process();
    });
  }

  private async process() {
    const filter = {
      startDate: _startDate(_today()),
      endDate: _endDate(_today()),
    };
    const messages = await this.message.cacheMessages({ ...filter, edited: false });
    for (const msg of messages) {
      const messageId = JSON.parse(msg.messageId);
      const chatId = JSON.parse(msg.chatId);
      const bet = await this.betRepository.bets({ ...filter, betId: msg.betId.toString() });
      if (!bet.length) continue;
      if (moment().diff(moment(bet[0].updatedAt), 'seconds') > 10810) {
        const result = JSON.parse(bet[0].bet);
        const diff = calcDiff(result.ss, result.league.name).diff;
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
