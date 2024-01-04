import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Configurations } from '../../configuration/configurations';
import { ConfigurationRepository } from '../../../domain/configuration-repository';

export class MongoConfigurationRepository implements ConfigurationRepository {
  constructor(
    @Inject
    private readonly mongoDb: MongoDb,
    @Inject
    private readonly configuration: Configurations,
  ) {}

  async setDiffGols(gameTime: number, diffGols: number) {
    const client = await this.mongoDb.getClient();
    const collection = client.db(this.configuration.mongoDbDiffGolsDatabase).collection('configurations');
    await collection.updateOne(
      { gameTime },
      {
        $set: {
          diffGols: diffGols,
          updatedAt: new Date(),
        },
      },
    );
  }
}
