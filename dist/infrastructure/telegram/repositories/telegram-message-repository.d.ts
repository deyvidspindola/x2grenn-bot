import { TelegramClient } from '../telegram-client';
import { sendMessage } from '../../../domain/entities/message';
import { MessageRepository } from '../../../domain/message-repository';
export declare class TelegramMessageRepository extends MessageRepository {
    private readonly telegramClient;
    constructor(telegramClient: TelegramClient);
    sendMessage(message: sendMessage): Promise<any>;
}
