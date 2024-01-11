import { editMessage, sendMessage } from '../entities/message';

export interface BotInterface {
  sendMessage(message: sendMessage): Promise<any>;
  editMessage(message: editMessage): Promise<any>;
  start(): Promise<void>;
}
