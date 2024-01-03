import { sendMessage } from '../entities/message';

export interface BotInterface {
  sendMessage(message: sendMessage): Promise<any>;
  start(): Promise<void>;
}
