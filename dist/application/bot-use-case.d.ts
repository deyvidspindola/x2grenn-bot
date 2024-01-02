import { MessageRepository } from '../domain/message-repository';
import { ChatRepository } from '../domain/chat-repository';
export declare class Bot {
    private readonly message;
    private readonly chat;
    constructor(message: MessageRepository, chat: ChatRepository);
    execute(): Promise<void>;
}
