import { Inject } from 'typescript-ioc';
import { schedule } from 'node-cron';
import { Bot } from '../application/bot-use-case';

export class BotRunHandle {
  constructor(@Inject private bot: Bot) {}

  public async run() {
    schedule('*/3 * * * * *', () => {
      this.bot.execute();
    });
  }

  public async run2() {
    schedule('*/5 * * * * *', () => {
      this.bot.execute();
    });
  }
}
