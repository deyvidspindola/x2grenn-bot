import { Inject } from 'typescript-ioc';
import { Configurations } from '../configuration/configurations';
import axios from 'axios';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';

export class BetApi {
  constructor(
    @Inject
    private config: Configurations,
    @Inject
    private repository: BotDiffGolsRepository,
  ) {}

  betApiKey: string = '';
  async setApiKey(betApiKey: string) {
    this.betApiKey = betApiKey;
  }

  public async getBetsInplay(): Promise<any> {
    try {
      const options = {
        method: 'GET',
        url: `${this.config.betApiUrl}/inplay_filter`,
        params: { sport_id: '1' },
        headers: {
          'X-RapidAPI-Key': this.betApiKey,
          'X-RapidAPI-Host': 'betsapi2.p.rapidapi.com',
        },
      };
      const response = await axios.request(options);
      return response;
    } catch (error) {
      const message = `⚠️ <b>Erro:</b>\n Erro ao buscar bets inplay\nDetalhes:\n ${error.code}`;
      this.repository.sendMessage({
        chatId: this.config.telegramDefaultChatId,
        message,
      });
      console.log(error);
      throw error;
    }
  }
}
