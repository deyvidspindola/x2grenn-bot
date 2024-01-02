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
exports.Bot = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const message_repository_1 = require("../domain/message-repository");
const chat_repository_1 = require("../domain/chat-repository");
let Bot = class Bot {
    constructor(message, chat) {
        this.message = message;
        this.chat = chat;
    }
    async execute() {
        try {
            const chats = await this.chat.chats();
            for (const chat of chats) {
                await this.message.sendMessage({
                    chatId: chat.chatId.toString(),
                    message: `Olá, ${chat.firstName}!`,
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.Bot = Bot;
exports.Bot = Bot = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __param(1, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [message_repository_1.MessageRepository,
        chat_repository_1.ChatRepository])
], Bot);
//# sourceMappingURL=bot-use-case.js.map