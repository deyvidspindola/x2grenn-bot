import { Bet, BetFilters } from './entities/bet';

export abstract class BetRepository {
  abstract init(database: string): Promise<any>;
  abstract save(bet: Bet): Promise<any>;
  abstract bets(filters: BetFilters): Promise<any>;
}
