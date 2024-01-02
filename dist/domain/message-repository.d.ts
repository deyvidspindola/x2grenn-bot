import { sendMessage } from './entities/message';
import { MessageInterface } from './repository-interface/message-interface';
export declare abstract class MessageRepository implements MessageInterface {
    abstract sendMessage(message: sendMessage): Promise<any>;
}
