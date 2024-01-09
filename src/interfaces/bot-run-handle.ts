import { Container } from 'typescript-ioc';
import { BotDiffGolsUseCase } from '../application/bot-diff-gols/bot-diff-gols-use-case';
import { BotDiffGolsReportUseCase } from '../application/bot-diff-gols/bot-diff-gols-report-use-case';

export class BotRunHandle {
  constructor() {}

  async runBotDiffGols() {
    const botDiffGolsUseCase = Container.get(BotDiffGolsUseCase);
    const botDiffGolsReportUseCase = Container.get(BotDiffGolsReportUseCase);
    await botDiffGolsUseCase.execute();
    await botDiffGolsReportUseCase.execute();
  }
}
