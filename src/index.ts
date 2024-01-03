import { Container } from 'typescript-ioc';
import config from './infrastructure/configuration/ioc.config';
import { MongoDb } from './infrastructure/mongodb/mongodb';
import { BotRunHandle } from './interfaces/bot-run-handle';

Container.configure(...config);
Container.namespace(process.env.NODE_ENV || 'development');

const mongoDb = Container.get(MongoDb);

export const handler = async () => {
  await mongoDb.connect();
  const botRunHandle = Container.get(BotRunHandle);
  await botRunHandle.run();
};

handler();
