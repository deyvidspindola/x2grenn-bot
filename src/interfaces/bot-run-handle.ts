import { Inject } from 'typescript-ioc';
import { schedule } from 'node-cron';
import { Bot } from '../application/bot-use-case';

export class BotRunHandle {
  constructor(@Inject private bot: Bot) {}

  public async run() {
    schedule('*/10 * * * * *', () => {
      this.bot.execute();
    });
  }
}
