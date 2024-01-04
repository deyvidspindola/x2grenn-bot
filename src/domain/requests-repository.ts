import { RepositoryInterface } from './repository-interface';

export abstract class RequestsRepository implements RepositoryInterface {
  abstract setApiKey(apiKey: string): Promise<any>;
  abstract execute(league: string): Promise<any>;
}
