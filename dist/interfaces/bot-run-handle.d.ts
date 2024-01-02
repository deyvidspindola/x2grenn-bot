import { Bot } from '../application/bot-use-case';
export declare class BotRunHandle {
    private bot;
    constructor(bot: Bot);
    run(): Promise<void>;
    run2(): Promise<void>;
}
