import { Inject } from 'typescript-ioc';
import { RequestsRepository } from '../../../domain/requests-repository';
import { BetApi } from '../bet-api';

export class BetRequestsRepository implements RequestsRepository {
  constructor(@Inject private betApi: BetApi) {}

  async setApiKey(apiKey: string) {
    await this.betApi.setApiKey(apiKey);
  }

  public async execute(league: string): Promise<any> {
    const response = await this.betApi.getBetsInplay();
    return response.data.results.filter((game: any) => game.league.name.includes(league));
  }
}
