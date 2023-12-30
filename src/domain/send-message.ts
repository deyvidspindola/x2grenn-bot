import { sendMessage } from './entities/message';
import { RepositoryInterface } from './repository-interface';

export abstract class SendMessage implements RepositoryInterface {
  abstract execute(message: sendMessage): Promise<any>;
}
