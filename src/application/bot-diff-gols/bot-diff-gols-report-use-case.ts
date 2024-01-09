import { Inject } from 'typescript-ioc';
import { BetRepository } from '../../domain/bet-repository';
import { Configurations } from '../../infrastructure/configuration/configurations';
import { MessageRepository } from '../../domain/message-repository';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
import { schedule } from 'node-cron';
import { calcDiff, _yesterday, _startDate, _endDate, _today } from '../utils';

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
  ) {
    this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
    this.message.init(this.configuration.mongoDbDiffGolsDatabase);
  }

  async execute() {
    await this.botDiffGolsRepository.sendMessage({
      chatId: this.configuration.telegramDefaultChatId,
      message: 'Bot Diff Gols Report is running',
    });
    schedule('0 0 * * *', async () => {
      await this.process();
    });
  }

  async process() {
    try {
      const filter = {
        startDate: _startDate(_yesterday()),
        endDate: _endDate(_yesterday()),
      };
      const betResults = await this.betRepository.oldBets(filter);
      const messages = await this.message.messages(filter);

      // Initialize counters for the reports
      let gamesLessThan3Goals8Mins = 0;
      let gamesLessThan4Goals10Mins = 0;
      let gamesLessThan4Goals12Mins = 0;

      for (const msg of messages) {
        const bet = betResults.find((b: any) => b.betId === msg.betId);
        if (!bet) continue;

        const betResult = JSON.parse(bet.bet);
        const diff = calcDiff(betResult.ss);

        if (betResult.league.name.includes('8 mins') && diff <= 3) {
          gamesLessThan3Goals8Mins++;
        } else if (betResult.league.name.includes('10 mins') && diff <= 4) {
          gamesLessThan4Goals10Mins++;
        } else if (betResult.league.name.includes('12 mins') && diff <= 4) {
          gamesLessThan4Goals12Mins++;
        }
      }

      this.botDiffGolsRepository.sendMessage({
        chatId: this.configuration.telegramDefaultChatId,
        message: `
        Relatório de <b>${_today()}</b>

        -------------[ <b>Total de Jogos</b> ]-------------
        8 minutos: <b>${betResults.filter((b: any) => b.bet.includes('8 mins')).length}</b>
        10 minutos: <b>${betResults.filter((b: any) => b.bet.includes('10 mins')).length}</b>
        12 minutos: <b>${betResults.filter((b: any) => b.bet.includes('12 mins')).length}</b>
        Total: <b>${betResults.length}</b>

        -------------[ <b>Jogos enviados</b> ]-------------
        8 minutos: <b>${messages.filter((m: any) => m.message.includes('8 mins')).length}</b>
        10 minutos: <b>${messages.filter((m: any) => m.message.includes('10 mins')).length}</b>
        12 minutos: <b>${messages.filter((m: any) => m.message.includes('12 mins')).length}</b>
        Total: <b>${messages.length}</b>
        
        ---------------------[ <b>Jogos</b> ]----------------------
        8 minutos menor ou igual a 3 gols: <b>${gamesLessThan3Goals8Mins}</b>
        10 minutos menor ou igual a 4 gols: <b>${gamesLessThan4Goals10Mins}</b>
        12 minutos menor ou igual a 4 gols: <b>${gamesLessThan4Goals12Mins}</b>
        Total: <b>${gamesLessThan3Goals8Mins + gamesLessThan4Goals10Mins + gamesLessThan4Goals12Mins}</b>
      `,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
