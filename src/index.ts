import { Container } from 'typescript-ioc';
import config from './infrastructure/configuration/ioc.config';
// import { MongoDb } from './infrastructure/mongodb/mongodb';
import { TelegramClient } from './infrastructure/telegram/telegram-client';
import { BotRunHandle } from './interfaces/bot-run-handle';

Container.configure(...config);
Container.namespace(process.env.NODE_ENV || 'development');

// const mongoDb = Container.get(MongoDb);
const telegramClient = Container.get(TelegramClient);

export const handler = async () => {
  // await mongoDb.connect();
  await telegramClient.start();
  await runBot();
};

handler();

export const runBot = async () => {
  console.log('Bot is running');
  const botRunHandle = Container.get(BotRunHandle);
  await botRunHandle.run();
};
