import { MongoDb } from '../mongodb';
import { Bet, BetFilters } from '../../../domain/entities/bet';
import { BetRepository } from '../../../domain/bet-repository';
export declare class MongoBetRepository implements BetRepository {
    private readonly mongoDb;
    constructor(mongoDb: MongoDb);
    collectionName: string;
    client: any;
    database: string;
    init(database: string): Promise<void>;
    save(bet: Bet): Promise<void>;
    bets(filters: BetFilters): Promise<any>;
}
