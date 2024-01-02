import { MongoClient } from 'mongodb';
import { Container, Factory, Inject, ObjectFactory } from 'typescript-ioc';
import { Configurations } from '../configuration/configurations';

export const repositoryRegisterStoryFactory: ObjectFactory = () => {
  const config = Container.get(Configurations);
  const mongoDb = new MongoClient(
    `${config.mongoDbDriver}://${config.mongoDbUsename}:${config.mongoDbPassword}@${config.mongoDbUri}/?retryWrites=true&w=majority`,
  );
  return new MongoDb(mongoDb, config.mongoDbDatabase);
};

@Factory(repositoryRegisterStoryFactory)
export class MongoDb {
  constructor(@Inject private client: MongoClient, private database: string) {
    this.database;
  }

  async connect() {
    await this.client.connect();
    console.log('Conectado ao MongoDB');
  }

  async getClient() {
    return this.client;
  }
}
