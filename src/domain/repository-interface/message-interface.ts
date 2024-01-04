import { Messages } from '../entities/message';

export interface MessageInterface {
  init(database: string): Promise<any>;
  save(message: Messages): Promise<any>;
  messages(): Promise<Messages[]>;
  removeMessages(): Promise<any>;
}
