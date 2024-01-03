import { Messages } from './entities/message';
import { MessageInterface } from './repository-interface/message-interface';

export abstract class MessageRepository implements MessageInterface {
  abstract save(message: Messages, database: string): Promise<any>;
  abstract messages(database: string): Promise<Messages[]>;
  abstract removeMessages(database: string): Promise<any>;
}
