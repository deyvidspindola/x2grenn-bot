import { Inject } from 'typescript-ioc';
import { BetRepository } from '../../domain/bet-repository';
import { Configurations } from '../../infrastructure/configuration/configurations';
import { MessageRepository } from '../../domain/message-repository';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
import { schedule } from 'node-cron';
import { calcDiff, _yesterday, _startDate, _endDate, _today } from '../utils';
import { ChatRepository } from '../../domain/chat-repository';
import moment from 'moment';
import { DiffGols } from '../../domain/entities/enums/diffgols';

export class BotDiffGolsReportUseCase {
  constructor(
    @Inject
    private readonly configuration: Configurations,
    @Inject
    private readonly betRepository: BetRepository,
    @Inject
    private readonly message: MessageRepository,
    @Inject
    private readonly botDiffGolsRepository: BotDiffGolsRepository,
    @Inject
    private readonly chat: ChatRepository,
  ) {
    this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
    this.message.init(this.configuration.mongoDbDiffGolsDatabase);
    this.chat.init(this.configuration.mongoDbDiffGolsDatabase);
  }

  async execute() {
    schedule('0 3 * * *', async () => {
      await this.sendReport();
    });
  }

  async sendReport() {
    try {
      const date = _yesterday();
      const process = await this.process(date);
      const chats = await this.chat.chats();
      const message = await this.messageReport(date, process, false);
      chats.map(async (chat: any) => {
        await this.botDiffGolsRepository.sendMessage({
          chatId: chat.chatId.toString(),
          message: message,
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async sendPartialReport(chatId: string) {
    try {
      const date = _today();
      const process = await this.process(date);
      const message = await this.messageReport(date, process, true);
      this.botDiffGolsRepository.sendMessage({
        chatId: chatId.toString(),
        message: message,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  private async process(date: string): Promise<any> {
    const filter = {
      startDate: _startDate(date),
      endDate: _endDate(date),
    };
    await this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
    const betResults = await this.betRepository.bets(filter);
    const messages = await this.message.messages(filter);

    // Initialize counters for the reports
    let gamesLessThan3Goals8Mins = 0;
    let gamesLessThan4Goals10Mins = 0;
    let gamesLessThan4Goals12Mins = 0;

    for (const msg of messages) {
      const bet = betResults.find((b: any) => b.betId === msg.betId);
      if (!bet) continue;

      const betResult = JSON.parse(bet.bet);
      const diff = calcDiff(betResult.ss, betResult.league.name).diff;

      if (betResult.league.name.includes('8 mins') && diff <= DiffGols.EIGHT_MIN) {
        gamesLessThan3Goals8Mins++;
      } else if (betResult.league.name.includes('10 mins') && diff <= DiffGols.TEN_MIN) {
        gamesLessThan4Goals10Mins++;
      } else if (betResult.league.name.includes('12 mins') && diff <= DiffGols.TWELVE_MIN) {
        gamesLessThan4Goals12Mins++;
      }
    }

    return {
      betResults,
      messages,
      gamesLessThan3Goals8Mins,
      gamesLessThan4Goals10Mins,
      gamesLessThan4Goals12Mins,
    };
  }

  async messageReport(date: string, process: any, partial: boolean) {
    let message = '';

    const dt = moment(date).format('DD/MM/YYYY');

    if (partial) {
      message = `
      *************************************
      <i>Esse é um relatório parcial do dia: <b>${dt}</b>.
      Lembrando que o relatório é enviado todos os dias às 00:00. Com todos os jogos do dia anterior.</i>
      *************************************
      .
      .`;
    }

    message =
      message +
      `
    Relatório de <b>${dt}</b>
    .
    <b>TOTAL DE JOGOS</b>
    ----------------------------------
    8 minutos: <b>${process.betResults.filter((b: any) => b.bet.includes('8 mins')).length}</b>
    10 minutos: <b>${process.betResults.filter((b: any) => b.bet.includes('10 mins')).length}</b>
    12 minutos: <b>${process.betResults.filter((b: any) => b.bet.includes('12 mins')).length}</b>
    Total: <b>${process.betResults.length}</b>
    .
    <b>JOGOS ENVIADOS</b>
    ----------------------------------
    8 minutos: <b>${process.messages.filter((m: any) => m.message.includes('8 mins')).length}</b>
    10 minutos: <b>${process.messages.filter((m: any) => m.message.includes('10 mins')).length}</b>
    12 minutos: <b>${process.messages.filter((m: any) => m.message.includes('12 mins')).length}</b>
    Total: <b>${process.messages.length}</b>
    .
    <b>JOGOS</b>
    ----------------------------------
    8 minutos menor ou igual a ${DiffGols.EIGHT_MIN} gols: <b>${process.gamesLessThan3Goals8Mins}</b>
    10 minutos menor ou igual a ${DiffGols.TEN_MIN} gols: <b>${process.gamesLessThan4Goals10Mins}</b>
    12 minutos menor ou igual a ${DiffGols.TWELVE_MIN} gols: <b>${process.gamesLessThan4Goals12Mins}</b>
    Total: <b>${
      process.gamesLessThan3Goals8Mins + process.gamesLessThan4Goals10Mins + process.gamesLessThan4Goals12Mins
    }</b>
    `;
    return message.replace(/^\s+/gm, '');
  }
}
