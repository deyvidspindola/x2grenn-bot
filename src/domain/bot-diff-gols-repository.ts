import { sendMessage } from './entities/message';
import { BotInterface } from './repository-interface/bot-interface';

export abstract class BotDiffGolsRepository implements BotInterface {
  abstract sendMessage(message: sendMessage): Promise<any>;
  abstract start(): Promise<void>;
}
