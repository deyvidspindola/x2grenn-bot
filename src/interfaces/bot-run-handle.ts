import { Container } from 'typescript-ioc';
import { BotDiffGolsUseCase } from '../application/bot-diff-gols/bot-diff-gols-use-case';
import { BotDiffGolsReportUseCase } from '../application/bot-diff-gols/bot-diff-gols-report-use-case';
import { BotDiffGolsEditMessageUseCase } from '../application/bot-diff-gols/bot-diff-gols-edit-message-use-case';

export class BotRunHandle {
  constructor() {}

  async runBotDiffGols() {
    await Container.get(BotDiffGolsUseCase).execute();
    await Container.get(BotDiffGolsEditMessageUseCase).execute();
    await Container.get(BotDiffGolsReportUseCase).execute();
  }
}
