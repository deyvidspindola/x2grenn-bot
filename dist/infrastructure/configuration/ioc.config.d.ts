import { ChatRepository } from '../../domain/chat-repository';
import { MongoChatRepository } from '../mongodb/repositories/mongo-chat-repository';
import { MessageRepository } from '../../domain/message-repository';
import { TelegramMessageRepository } from '../telegram/repositories/telegram-message-repository';
declare const _default: ({
    bindName: string;
    to: unknown;
    bind?: undefined;
} | {
    bind: typeof MessageRepository;
    to: typeof TelegramMessageRepository;
    bindName?: undefined;
} | {
    bind: typeof ChatRepository;
    to: typeof MongoChatRepository;
    bindName?: undefined;
})[];
export default _default;
