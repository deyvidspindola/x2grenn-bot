import { BetRepository } from '../../domain/bet-repository';
import { Configurations } from '../../infrastructure/configuration/configurations';
import { MessageRepository } from '../../domain/message-repository';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
import { ChatRepository } from '../../domain/chat-repository';
export declare class BotDiffGolsReportUseCase {
    private readonly configuration;
    private readonly betRepository;
    private readonly message;
    private readonly botDiffGolsRepository;
    private readonly chat;
    constructor(configuration: Configurations, betRepository: BetRepository, message: MessageRepository, botDiffGolsRepository: BotDiffGolsRepository, chat: ChatRepository);
    execute(): Promise<void>;
    sendReport(): Promise<void>;
    sendPartialReport(chatId: string): Promise<void>;
    private process;
    messageReport(date: string, process: any, partial: boolean): Promise<string>;
}
