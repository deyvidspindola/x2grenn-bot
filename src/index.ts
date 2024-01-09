import { Container } from 'typescript-ioc';
import config from './infrastructure/configuration/ioc.config';
import { MongoDb } from './infrastructure/mongodb/mongodb';
import { BotRunHandle } from './interfaces/bot-run-handle';

Container.configure(...config);
Container.namespace(process.env.NODE_ENV || 'development');

export const handler = async () => {
  const mongoDb = Container.get(MongoDb);
  const botRunHandle = Container.get(BotRunHandle);

  await mongoDb.connect();
  await botRunHandle.runBotDiffGols();
};

handler();
