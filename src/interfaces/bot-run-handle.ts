import { Inject } from 'typescript-ioc';
import { schedule } from 'node-cron';
import { BotDiffGolsUseCase } from '../application/bot-diff-gols-use-case';
import { BotDiffGolsRepository } from '../domain/bot-diff-gols-repository';
import { MessageRepository } from '../domain/message-repository';
import { Configurations } from '../infrastructure/configuration/configurations';

export class BotRunHandle {
  constructor(
    @Inject
    private botDiffGolsUseCase: BotDiffGolsUseCase,
    @Inject
    private readonly botDiffGolsRepository: BotDiffGolsRepository,
    @Inject
    private readonly mensage: MessageRepository,
    @Inject
    private readonly configuration: Configurations,
  ) {}

  public async run() {
    console.log('Bot 1 is running');
    await this.botDiffGolsRepository.start();
    schedule('*/3 * * * * *', async () => {
      await this.botDiffGolsUseCase.execute();
    });

    // Remove mensagens
    schedule('"0 0 */1 * * *"', async () => {
      console.log('Removendo mensagens');
      await this.mensage.removeMessages(this.configuration.mongoDbDatabase);
      await this.botDiffGolsRepository.sendMessage({
        chatId: this.configuration.telegramDefaultChatId,
        message: 'Removendo mensagens',
      });
    });
  }
}
