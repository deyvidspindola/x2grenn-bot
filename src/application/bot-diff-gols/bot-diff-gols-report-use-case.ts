import moment from 'moment';
import { Inject } from 'typescript-ioc';
import { BetRepository } from '../../domain/bet-repository';
import { Configurations } from '../../infrastructure/configuration/configurations';

export class BotDiffGolsReportUseCase {
  constructor(
    @Inject
    private readonly configuration: Configurations,
    @Inject
    private readonly betRepository: BetRepository,
  ) {
    this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
  }

  async execute() {
    try {
      const today = moment().subtract(1, 'days').format('YYYY-MM-DD');
      const startDate = moment(today).startOf('day').toDate(); // Meia-noite do dia desejado
      const endDate = moment(today).endOf('day').toDate();
      const betResults = await this.betRepository.oldBets({ startDate, endDate });
      console.log('betResults', betResults);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
