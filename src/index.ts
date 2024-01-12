import { Container } from 'typescript-ioc';
import config from './infrastructure/configuration/ioc.config';
import { MongoDb } from './infrastructure/mongodb/mongodb';
import { BotRunHandle } from './interfaces/bot-run-handle';

Container.configure(...config);
Container.namespace(process.env.NODE_ENV || 'development');

export const handler = async () => {
  await Container.get(MongoDb).connect();
  await Container.get(BotRunHandle).runBotDiffGols();
};

handler();
