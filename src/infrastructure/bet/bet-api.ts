import { Container } from 'typescript-ioc';
import { Configurations } from '../configuration/configurations';
import axios from 'axios';

export class BetApi {
  constructor() {}

  public async getBetsInplay(league: string): Promise<any> {
    const config = Container.get(Configurations);
    const url = `${config.betApiUrl}/v1/bet365/inplay_filter?sport_id=1&token=${config.betApiKey}`;
    const response = await axios.get(url);
    return response.data.results.filter((game) => game.league.name.includes(league));
  }
}
