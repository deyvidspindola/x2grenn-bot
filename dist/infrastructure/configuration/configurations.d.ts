export declare class Configurations {
    config: any;
    constructor(config: any);
    /**
     * ENVIRONMENT
     */
    get environment(): string;
    /**
     * MONDODB
     */
    get mongoDbDriver(): string;
    get mongoDbUri(): string;
    get mongoDbUsename(): string;
    get mongoDbPassword(): string;
    /**
     * TELEGRAM
     */
    get telegramDefaultChatId(): string;
    /**
     * BET
     */
    get betUrl(): string;
    get betApiUrl(): string;
    /**
     * BOT DIFF GOLS
     */
    get mongoDbDiffGolsDatabase(): string;
    get telegramBotDiffGolsToken(): string;
    get betBotDiffGolsApiKey(): string;
    /**
     * BOT WINS
     */
    get mongoDbWinsDatabase(): string;
    get telegramBotWinsToken(): string;
    get betBotWinsApiKey(): string;
    private getEnvVariable;
}
