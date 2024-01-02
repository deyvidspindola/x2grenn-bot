import { Inject } from 'typescript-ioc';
import { RequestsRepository } from '../../../domain/requests-repository';
import { BetApi } from '../bet-api';

export class BetRequestsRepository extends RequestsRepository {
  constructor(@Inject private betApi: BetApi) {
    super();
  }

  public async execute(league: string): Promise<any> {
    return this.betApi.getBetsInplay(league);
  }
}
