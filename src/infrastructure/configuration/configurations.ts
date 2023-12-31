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
   * MONDODB
   */
  public get mongoDbDriver(): string {
    return this.getEnvVariable(this.config.mongodb.driver);
  }

  public get mongoDbUri(): string {
    return this.getEnvVariable(this.config.mongodb.uri);
  }

  public get mongoDbDatabase(): string {
    return this.getEnvVariable(this.config.mongodb.database);
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

  public get telegramToken(): string {
    return this.getEnvVariable(this.config.telegram.token);
  }

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

  public get betApiKey(): string {
    return this.getEnvVariable(this.config.bet.apiKey);
  }

  private getEnvVariable(value: any) {
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      const envVariable = value.substring(2, value.length - 1);
      return process.env[envVariable];
    }
    return value;
  }
}
