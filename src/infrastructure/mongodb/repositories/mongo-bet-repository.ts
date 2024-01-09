import { Inject } from 'typescript-ioc';
import { MongoDb } from '../mongodb';
import { Bet, BetFilters } from '../../../domain/entities/bet';
import { BetRepository } from '../../../domain/bet-repository';
import { _todayNow } from '../../../application/utils';

export class MongoBetRepository implements BetRepository {
  constructor(
    @Inject
    private readonly mongoDb: MongoDb,
  ) {}

  collectionName = 'bets';
  client: any;
  database: string;

  async init(database: string) {
    this.client = await this.mongoDb.getClient();
    this.database = database;
  }

  async save(bet: Bet) {
    const collection = this.client.db(this.database).collection(this.collectionName);
    const document = await collection.findOne({ betId: bet.betId });
    if (document) {
      await collection.updateOne(
        { betId: bet.betId },
        {
          $set: {
            bet: bet.bet,
            updatedAt: _todayNow(),
          },
        },
      );
      return;
    }
    await collection.insertOne(bet);
  }

  async oldBets(filters: BetFilters) {
    const collection = this.client.db(this.database).collection(this.collectionName);
    const documents = await collection
      .find({
        createdAt: {
          $gte: filters.startDate,
          $lte: filters.endDate,
        },
      })
      .toArray();
    return documents;
  }
}
