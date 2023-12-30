import { sendMessage } from '../entities/message';

export interface TelegramInterface {
  sendMessage(message: sendMessage): Promise<void>;
  subscribe(): Promise<void>;
  unsubscribe(): Promise<void>;
}
