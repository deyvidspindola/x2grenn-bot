import { Messages } from '../entities/message';

export interface MessageInterface {
  save(chat: Messages, database: string): Promise<any>;
  messages(database: string): Promise<Messages[]>;
}
