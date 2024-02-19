"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoMessageRepository = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const mongodb_1 = require("../mongodb");
const memoryCache = __importStar(require("memory-cache"));
let MongoMessageRepository = class MongoMessageRepository {
    constructor(mongoDb) {
        this.mongoDb = mongoDb;
        this.collectionName = 'messages';
    }
    async init(database) {
        this.client = await this.mongoDb.getClient();
        this.database = database;
    }
    async save(message) {
        const collection = this.client.db(this.database).collection(this.collectionName);
        await collection.insertOne(message);
    }
    async update(message_id) {
        const collection = this.client.db(this.database).collection(this.collectionName);
        await collection.updateOne({ _id: message_id }, {
            $set: {
                edited: true,
            },
        });
    }
    async messages(filters = null) {
        const collection = this.client.db(this.database).collection(this.collectionName);
        let query = {};
        if (filters !== null) {
            query = {
                createdAt: {
                    $gte: filters.startDate,
                    $lte: filters.endDate,
                },
            };
            if (filters.edited !== undefined) {
                if ('edited' in query) {
                    query.edited = filters.edited;
                }
                else {
                    query = {
                        ...query,
                        edited: filters.edited,
                    };
                }
            }
        }
        const documents = await collection.find(query).toArray();
        return documents.map((doc) => doc);
    }
    async removeMessages() {
        const collection = this.client.db(this.database).collection(this.collectionName);
        await collection.deleteMany({});
    }
    async cacheMessages(filters = null) {
        const cacheKey = 'messages';
        const cachedMessages = memoryCache.get(cacheKey);
        if (cachedMessages) {
            return cachedMessages;
        }
        const messages = await this.messages(filters);
        memoryCache.put(cacheKey, messages, 60000);
        return messages;
    }
};
exports.MongoMessageRepository = MongoMessageRepository;
exports.MongoMessageRepository = MongoMessageRepository = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [mongodb_1.MongoDb])
], MongoMessageRepository);
//# sourceMappingURL=mongo-message-repository.js.map