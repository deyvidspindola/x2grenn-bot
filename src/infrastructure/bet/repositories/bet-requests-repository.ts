import { Inject } from 'typescript-ioc';
import { RequestsRepository } from '../../../domain/requests-repository';
import { BetApi } from '../bet-api';
import { EventSTTypes } from '../../../domain/entities/enums/diffgols';

export class BetRequestsRepository implements RequestsRepository {
  constructor(@Inject private betApi: BetApi) {}

  async setApiKey(apiKey: string) {
    await this.betApi.setApiKey(apiKey);
  }

  public async execute(league: string): Promise<any> {
    const response = await this.betApi.getBetsInplay();
    return response.data.results.filter((game: any) => game.league.name.includes(league));
  }

  public async events(event_id: string): Promise<any> {
    const response = await this.betApi.getEvents(event_id);
    const data = response.data.results[0].filter((event: any) => event.type === 'ST' && event.IC === EventSTTypes.GOLS);
    return data[0].LA;
  }
}
