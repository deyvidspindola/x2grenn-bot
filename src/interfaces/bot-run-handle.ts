import { Container, Inject } from 'typescript-ioc';
import { schedule } from 'node-cron';
import { BotDiffGolsUseCase } from '../application/bot-diff-gols-use-case';
import { MessageRepository } from '../domain/message-repository';
import { Configurations } from '../infrastructure/configuration/configurations';
import { BotDiffGolsRepository } from '../domain/bots/repository/bot-diff-gols-repository';
import { BotWinsUseCase } from '../application/bot-wins-use-case';
import { BotWinsRepository } from '../domain/bots/repository/bot-wins-repository';

export class BotRunHandle {
  constructor(
    @Inject
    private readonly mensage: MessageRepository,
    @Inject
    private readonly configuration: Configurations,
  ) {}

  async runBotDiffGols() {
    const botDiffGolsUseCase = Container.get(BotDiffGolsUseCase);
    const botDiffGolsRepository = Container.get(BotDiffGolsRepository);
    await botDiffGolsRepository.start();
    schedule('*/1 * * * * *', async () => {
      await botDiffGolsUseCase.execute();
    });

    // Remove mensagens
    schedule('0 0 */1 * * *', async () => {
      console.log('Removendo mensagens');
      await this.mensage.init(this.configuration.mongoDbDiffGolsDatabase);
      await this.mensage.removeMessages();
      await botDiffGolsRepository.sendMessage({
        chatId: this.configuration.telegramDefaultChatId,
        message: 'Removendo mensagens',
      });
    });
  }

  // Bot Wins
  async runBotWins() {
    const botWinsUseCase = Container.get(BotWinsUseCase);
    const botWinsRepository = Container.get(BotWinsRepository);
    await botWinsRepository.start();
    schedule('*/1 * * * * *', async () => {
      await botWinsUseCase.execute();
    });

    // Remove mensagens
    schedule('0 0 */1 * * *', async () => {
      console.log('Removendo mensagens');
      await this.mensage.init(this.configuration.mongoDbWinsDatabase);
      await this.mensage.removeMessages();
      await botWinsRepository.sendMessage({
        chatId: this.configuration.telegramDefaultChatId,
        message: 'Removendo mensagens',
      });
    });
  }
}
