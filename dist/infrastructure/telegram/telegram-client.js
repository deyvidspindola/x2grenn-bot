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
exports.TelegramClient = exports.repositoryRegisterStoryFactory = void 0;
const grammy_1 = require("grammy");
const typescript_ioc_1 = require("typescript-ioc");
const configurations_1 = require("../configuration/configurations");
const chat_status_1 = require("../../domain/entities/enums/chat-status");
const chat_repository_1 = require("../../domain/chat-repository");
const repositoryRegisterStoryFactory = () => {
    const config = typescript_ioc_1.Container.get(configurations_1.Configurations);
    const telegramClient = new grammy_1.Bot(config.telegramToken);
    return new TelegramClient(telegramClient);
};
exports.repositoryRegisterStoryFactory = repositoryRegisterStoryFactory;
let TelegramClient = class TelegramClient {
    constructor(client) {
        this.client = client;
        this.client;
        this.chat = typescript_ioc_1.Container.get(chat_repository_1.ChatRepository);
    }
    async start() {
        this.client.start();
        await this.subscribe();
        await this.unsubscribe();
        console.log('Conectado ao Telegram');
    }
    async sendMessage(chatId, message) {
        await this.client.api.sendMessage(chatId, message);
    }
    async subscribe() {
        this.client.command('start', async (ctx) => {
            const chatId = ctx.chat?.id;
            if (await this.chat.exists(chatId)) {
                this.sendMessage(chatId.toString(), `Olá, ${ctx.from?.first_name}! Você já está cadastrado no bot\nPara sair digite /sair`);
                return;
            }
            const firstName = ctx.from?.first_name;
            const lastName = ctx.from?.last_name;
            const message = `Olá ${firstName} ${lastName} seja bem vindo ao bot\nPara sair digite /sair`;
            const data = {
                firstName,
                lastName,
                chatId,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: chat_status_1.ChatStatus.ACTIVE,
            };
            this.chat.save(data);
            this.sendMessage(chatId.toString(), message);
        });
    }
    async unsubscribe() {
        this.client.command('sair', async (ctx) => {
            const chatId = ctx.chat?.id;
            if (!(await this.chat.exists(chatId))) {
                this.sendMessage(chatId.toString(), `Olá, ${ctx.from?.first_name}! Você não está cadastrado no bot\nPara se cadastrar digite /start`);
                return;
            }
            const firstName = ctx.from?.first_name;
            const lastName = ctx.from?.last_name;
            const message = `Olá ${firstName} ${lastName}, que pena que você está saindo do bot\nPara se cadastrar digite /start`;
            this.chat.remove(chatId);
            this.sendMessage(chatId.toString(), message);
        });
    }
};
exports.TelegramClient = TelegramClient;
exports.TelegramClient = TelegramClient = __decorate([
    (0, typescript_ioc_1.Factory)(exports.repositoryRegisterStoryFactory),
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [grammy_1.Bot])
], TelegramClient);
//# sourceMappingURL=telegram-client.js.map