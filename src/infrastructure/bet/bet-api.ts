import { Inject } from 'typescript-ioc';
import { Configurations } from '../configuration/configurations';
import axios from 'axios';
import { Environments } from '../../domain/entities/enums/environment';
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
      if (this.config.environment === Environments.DEV) {
        return this.getMock();
      }
      const url = `${this.config.betApiUrl}/v1/bet365/inplay_filter?sport_id=1&token=${this.betApiKey}`;
      const response = await axios.get(url);
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

  async getMock() {
    return {
      data: {
        success: 1,
        pager: {
          page: 1,
          per_page: 1000,
          total: 71,
        },
        results: [
          {
            id: '112919479',
            sport_id: '1',
            time: '1640828040',
            time_status: '1',
            league: {
              id: '10047781',
              name: 'Esoccer Battle - 8 mins play',
            },
            home: {
              id: '10749284',
              name: 'Tottenham (Nik33) Esports',
            },
            away: {
              id: '10613750',
              name: 'Liverpool (Calvin) Esports',
            },
            ss: '0-3',
            our_event_id: '4499000',
            r_id: '112919479C1A',
            ev_id: '15692509192C1',
            updated_at: '1640828487',
          },
        ],
      },
    };
  }
}
