"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBetRepository = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const mongodb_1 = require("../mongodb");
const utils_1 = require("../../../application/utils");
let MongoBetRepository = class MongoBetRepository {
    constructor(mongoDb) {
        this.mongoDb = mongoDb;
        this.collectionName = 'bets';
    }
    async init(database) {
        this.client = await this.mongoDb.getClient();
        this.database = database;
    }
    async save(bet) {
        const collection = this.client.db(this.database).collection(this.collectionName);
        const document = await collection.findOne({ betId: bet.betId });
        if (document) {
            await collection.updateOne({ betId: bet.betId }, {
                $set: {
                    bet: bet.bet,
                    updatedAt: (0, utils_1._todayNow)(),
                },
            });
            return;
        }
        await collection.insertOne(bet);
    }
    async bets(filters) {
        const collection = this.client.db(this.database).collection(this.collectionName);
        let query = {};
        if (filters !== null) {
            query = {
                createdAt: {
                    $gte: filters.startDate,
                    $lte: filters.endDate,
                },
                ...(filters.betId ? { betId: filters.betId } : {}),
            };
        }
        const documents = await collection.find(query).toArray();
        return documents;
    }
};
exports.MongoBetRepository = MongoBetRepository;
exports.MongoBetRepository = MongoBetRepository = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [mongodb_1.MongoDb])
], MongoBetRepository);
//# sourceMappingURL=mongo-bet-repository.js.map