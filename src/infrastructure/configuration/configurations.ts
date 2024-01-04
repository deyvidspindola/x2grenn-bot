import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { Factory, ObjectFactory, Singleton } from 'typescript-ioc';
import { load } from 'js-yaml';

config();

const configProivder: ObjectFactory = () => {
  const configFileName = `config/server-config.yml`;
  const config = load(readFileSync(configFileName, 'utf8'));
  return new Configurations(config);
};

@Singleton
@Factory(configProivder)
export class Configurations {
  public config: any;
  constructor(config: any) {
    this.config = config;
  }

  /**
   * ENVIRONMENT
   */
  public get environment(): string {
    return this.getEnvVariable(this.config.environment);
  }

  /**
   * MONDODB
   */
  public get mongoDbDriver(): string {
    return this.getEnvVariable(this.config.mongodb.driver);
  }

  public get mongoDbUri(): string {
    return this.getEnvVariable(this.config.mongodb.uri);
  }

  public get mongoDbUsename(): string {
    return this.getEnvVariable(this.config.mongodb.username);
  }

  public get mongoDbPassword(): string {
    return this.getEnvVariable(this.config.mongodb.password);
  }

  /**
   * TELEGRAM
   */

  public get telegramDefaultChatId(): string {
    return this.getEnvVariable(this.config.telegram.defaultChatId);
  }

  /**
   * BET
   */

  public get betUrl(): string {
    return this.getEnvVariable(this.config.bet.url);
  }

  public get betApiUrl(): string {
    return this.getEnvVariable(this.config.bet.apiUrl);
  }

  /**
   * BOT DIFF GOLS
   */
  public get mongoDbDiffGolsDatabase(): string {
    return this.getEnvVariable(this.config.mongodb.database.diffGols);
  }

  public get telegramBotDiffGolsToken(): string {
    return this.getEnvVariable(this.config.telegram.bot.diffGols.token);
  }

  public get betBotDiffGolsApiKey(): string {
    return this.getEnvVariable(this.config.bet.apiKey.diffGols);
  }

  /**
   * BOT WINS
   */
  public get mongoDbWinsDatabase(): string {
    return this.getEnvVariable(this.config.mongodb.database.wins);
  }

  public get telegramBotWinsToken(): string {
    return this.getEnvVariable(this.config.telegram.bot.wins.token);
  }

  public get betBotWinsApiKey(): string {
    return this.getEnvVariable(this.config.bet.apiKey.wins);
  }

  private getEnvVariable(value: any) {
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      const envVariable = value.substring(2, value.length - 1);
      return process.env[envVariable];
    }
    return value;
  }
}
