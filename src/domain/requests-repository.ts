import { RepositoryInterface } from './repository-interface';

export abstract class RequestsRepository implements RepositoryInterface {
  abstract execute(league: string): Promise<any>;
}
