export declare class Configurations {
    config: any;
    constructor(config: any);
    /**
     * MONDODB
     */
    get mongoDbDriver(): string;
    get mongoDbUri(): string;
    get mongoDbDatabase(): string;
    get mongoDbUsename(): string;
    get mongoDbPassword(): string;
    /**
     * TELEGRAM
     */
    get telegramToken(): string;
    get telegramDefaultChatId(): string;
    /**
     * BET
     */
    get betUrl(): string;
    get betApiUrl(): string;
    get betApiKey(): string;
    private getEnvVariable;
}
