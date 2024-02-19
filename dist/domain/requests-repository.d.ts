import { RepositoryInterface } from './repository-interface';
export declare abstract class RequestsRepository implements RepositoryInterface {
    abstract setApiKey(apiKey: string): Promise<any>;
    abstract execute(league: string): Promise<any>;
    abstract events(event_id: string): Promise<any>;
}
