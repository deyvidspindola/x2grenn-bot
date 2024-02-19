import { ChatRepository } from '../../domain/chat-repository';
import { RequestsRepository } from '../../domain/requests-repository';
import { Configurations } from '../../infrastructure/configuration/configurations';
import { MessageRepository } from '../../domain/message-repository';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
import { BetRepository } from '../../domain/bet-repository';
export declare class BotDiffGolsUseCase {
    private readonly configuration;
    private readonly requests;
    private readonly botDiffGolsRepository;
    private readonly chat;
    private readonly message;
    private readonly betRepository;
    constructor(configuration: Configurations, requests: RequestsRepository, botDiffGolsRepository: BotDiffGolsRepository, chat: ChatRepository, message: MessageRepository, betRepository: BetRepository);
    execute(): Promise<void>;
    private initialize;
    private initRepositories;
    private startBot;
    private process;
    private sendMessageDiffGols;
    private shouldSendMessage;
    private createMessage;
    private sendMessageToChats;
    private saveMessages;
    private saveBets;
    private getLastGoal;
}
