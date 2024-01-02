import { sendMessage } from '../entities/message';
export interface MessageInterface {
    sendMessage(message: sendMessage): Promise<any>;
}
