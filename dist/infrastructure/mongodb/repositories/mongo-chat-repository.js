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
exports.MongoChatRepository = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const mongodb_1 = require("../mongodb");
const chat_repository_1 = require("../../../domain/chat-repository");
const chat_status_1 = require("../../../domain/entities/enums/chat-status");
let MongoChatRepository = class MongoChatRepository extends chat_repository_1.ChatRepository {
    constructor(mongoDb) {
        super();
        this.mongoDb = mongoDb;
    }
    async save(chat) {
        return await this.mongoDb.saveChat(chat);
    }
    async remove(chatId) {
        await this.mongoDb.removeChat(chatId);
    }
    async chats() {
        return await this.mongoDb.chats();
    }
    async exists(chatId) {
        const chats = await this.mongoDb.chats();
        return chats.some((chat) => chat.chatId === chatId && chat.status === chat_status_1.ChatStatus.ACTIVE);
    }
};
exports.MongoChatRepository = MongoChatRepository;
exports.MongoChatRepository = MongoChatRepository = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [mongodb_1.MongoDb])
], MongoChatRepository);
//# sourceMappingURL=mongo-chat-repository.js.map