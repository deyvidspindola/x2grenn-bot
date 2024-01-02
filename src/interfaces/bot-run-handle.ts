import { Inject } from 'typescript-ioc';
import { schedule } from 'node-cron';
import { BotDiffGolsUseCase } from '../application/bot-diff-gols-use-case';

export class BotRunHandle {
  constructor(@Inject private botDiffGolsUseCase: BotDiffGolsUseCase) {}

  public async run() {
    schedule('*/3 * * * * *', () => {
      this.botDiffGolsUseCase.execute();
    });
  }
}
