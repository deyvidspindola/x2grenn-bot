import { RequestsRepository } from '../../../domain/requests-repository';
import { BetApi } from '../bet-api';
export declare class BetRequestsRepository implements RequestsRepository {
    private betApi;
    constructor(betApi: BetApi);
    setApiKey(apiKey: string): Promise<void>;
    execute(league: string): Promise<any>;
    events(event_id: string): Promise<any>;
}
