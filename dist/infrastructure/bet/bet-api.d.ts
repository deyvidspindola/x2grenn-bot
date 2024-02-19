import { Configurations } from '../configuration/configurations';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
export declare class BetApi {
    private config;
    private repository;
    constructor(config: Configurations, repository: BotDiffGolsRepository);
    betApiKey: string;
    setApiKey(betApiKey: string): Promise<void>;
    getBetsInplay(): Promise<any>;
    getEvents(event_id: string): Promise<any>;
}
