import { Container } from 'typescript-ioc';
import config from './infrastructure/configuration/ioc.config';
import { MongoDb } from './infrastructure/mongodb/mongodb';
import { BotRunHandle } from './interfaces/bot-run-handle';
import { Environments } from './domain/entities/enums/environment';

Container.configure(...config);
Container.namespace(process.env.NODE_ENV || 'development');

export const handler = async () => {
  const mongoDb = Container.get(MongoDb);
  const botRunHandle = Container.get(BotRunHandle);

  await mongoDb.connect();
  if (process.env.ENVIRONMENT === Environments.DEV) {
    await botRunHandle.runBotWins();
  }
  if (process.env.ENVIRONMENT === Environments.PRD) {
    await botRunHandle.runBotDiffGols();
  }
};

handler();
