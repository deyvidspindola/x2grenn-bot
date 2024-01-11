import { Messages } from './entities/message';
import { MessageInterface } from './repository-interface/message-interface';

export abstract class MessageRepository implements MessageInterface {
  abstract init(database: string): Promise<any>;
  abstract save(message: Messages): Promise<any>;
  abstract update(message_id: string): Promise<any>;
  abstract messages(filters?: any, type?: string): Promise<Messages[]>;
  abstract removeMessages(): Promise<any>;
}
