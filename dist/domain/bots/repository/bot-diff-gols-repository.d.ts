import { editMessage, sendMessage } from '../../entities/message';
import { BotInterface } from '../../repository-interface';
export declare abstract class BotDiffGolsRepository implements BotInterface {
    abstract sendMessage(message: sendMessage): Promise<any>;
    abstract editMessage(message: editMessage): Promise<any>;
    abstract start(): Promise<void>;
}
