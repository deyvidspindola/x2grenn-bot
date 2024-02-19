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
exports.MongoChatRepository = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const mongodb_1 = require("../mongodb");
const chat_status_1 = require("../../../domain/entities/enums/chat-status");
const utils_1 = require("../../../application/utils");
const memoryCache = __importStar(require("memory-cache"));
let MongoChatRepository = class MongoChatRepository {
    constructor(mongoDb) {
        this.mongoDb = mongoDb;
        this.collectionName = 'chats';
    }
    async init(database) {
        this.client = await this.mongoDb.getClient();
        this.database = database;
    }
    async save(chat) {
        const collection = this.client.db(this.database).collection(this.collectionName);
        const document = await collection.findOne({ chatId: chat.chatId });
        if (document) {
            await collection.updateOne({ chatId: chat.chatId }, {
                $set: {
                    status: chat.status,
                    updatedAt: (0, utils_1._todayNow)(),
                    deletedAt: null,
                },
            });
            return;
        }
        await collection.insertOne(chat);
    }
    async remove(chatId) {
        const collection = this.client.db(this.database).collection(this.collectionName);
        await collection.updateOne({ chatId }, {
            $set: {
                status: chat_status_1.ChatStatus.INACTIVE,
                deletedAt: (0, utils_1._todayNow)(),
                updatedAt: (0, utils_1._todayNow)(),
            },
        });
    }
    async chats() {
        const collection = this.client.db(this.database).collection(this.collectionName);
        const documents = await collection.find().toArray();
        return documents
            .map((doc) => doc)
            .filter((doc) => doc.status === chat_status_1.ChatStatus.ACTIVE);
    }
    async exists(chatId) {
        const chats = await this.chats();
        return chats.some((chat) => chat.chatId === chatId && chat.status === chat_status_1.ChatStatus.ACTIVE);
    }
    async cacheChats() {
        const cacheKey = 'chats';
        const cachedChats = memoryCache.get(cacheKey);
        if (cachedChats) {
            return cachedChats;
        }
        const chats = await this.chats();
        memoryCache.put(cacheKey, chats, 60000);
        return chats;
    }
};
exports.MongoChatRepository = MongoChatRepository;
exports.MongoChatRepository = MongoChatRepository = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [mongodb_1.MongoDb])
], MongoChatRepository);
//# sourceMappingURL=mongo-chat-repository.js.map