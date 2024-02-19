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
exports.TelegramBotDiffGolsRepository = exports.repositoryRegisterStoryFactory = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const grammy_1 = require("grammy");
const chat_status_1 = require("../../../domain/entities/enums/chat-status");
const chat_repository_1 = require("../../../domain/chat-repository");
const configurations_1 = require("../../configuration/configurations");
const bot_diff_gols_report_use_case_1 = require("../../../application/bot-diff-gols/bot-diff-gols-report-use-case");
const utils_1 = require("../../../application/utils");
const bot_diff_gols_edit_message_use_case_1 = require("../../../application/bot-diff-gols/bot-diff-gols-edit-message-use-case");
const repositoryRegisterStoryFactory = () => {
    const config = typescript_ioc_1.Container.get(configurations_1.Configurations);
    const telegramClient = new grammy_1.Bot(config.telegramBotDiffGolsToken);
    return new TelegramBotDiffGolsRepository(telegramClient, config);
};
exports.repositoryRegisterStoryFactory = repositoryRegisterStoryFactory;
let TelegramBotDiffGolsRepository = class TelegramBotDiffGolsRepository {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.client;
        this.config;
        this.chat = typescript_ioc_1.Container.get(chat_repository_1.ChatRepository);
        this.chat.init(this.config.mongoDbDiffGolsDatabase);
    }
    async start() {
        this.client.start();
        await this.subscribe();
        await this.unsubscribe();
        await this.report();
        await this.forceEdit();
        console.log('Conectado ao BOT Diff Gols');
    }
    async sendMessage(message) {
        return await this.client.api
            .sendMessage(message.chatId, message.message, {
            parse_mode: 'HTML',
            link_preview_options: { is_disabled: true },
            protect_content: true,
        })
            .catch(async (err) => {
            if (err.error_code === 403) {
                await this.chat.remove(Number(message.chatId));
            }
            throw err;
        });
    }
    async editMessage(message) {
        await this.client.api.editMessageText(message.chatId, Number(message.messageId), message.message, {
            parse_mode: 'HTML',
            link_preview_options: { is_disabled: true },
        });
    }
    async subscribe() {
        this.client.command('0022554433', async (ctx) => {
            const chatId = ctx.chat?.id;
            const firstName = ctx.from?.first_name;
            const lastName = ctx.from?.last_name;
            const name = `<b>${firstName} ${lastName}</b>`;
            if (await this.chat.exists(chatId)) {
                this.sendMessage({
                    chatId: chatId.toString(),
                    message: `Olá, ${name}! Você já está cadastrado!\nPara sair digite /sair`,
                });
                return;
            }
            const message = `Olá ${name} seja bem vindo!\nPara sair digite /sair`;
            const data = {
                firstName,
                lastName,
                chatId,
                createdAt: (0, utils_1._todayNow)(),
                updatedAt: (0, utils_1._todayNow)(),
                status: chat_status_1.ChatStatus.ACTIVE,
            };
            this.chat.save(data);
            this.sendMessage({ chatId: chatId.toString(), message });
        });
    }
    async unsubscribe() {
        this.client.command('sair', async (ctx) => {
            const chatId = ctx.chat?.id;
            const firstName = ctx.from?.first_name;
            const lastName = ctx.from?.last_name;
            const name = `<b>${firstName} ${lastName}</b>`;
            if (!(await this.chat.exists(chatId))) {
                this.sendMessage({
                    chatId: chatId.toString(),
                    message: `Olá, ${name}! Você não está cadastrado!\nPara se cadastrar digite /start`,
                });
                return;
            }
            const message = `Olá ${name}, que pena que você está saindo.\nPara se cadastrar digite /start`;
            this.chat.remove(chatId);
            this.sendMessage({ chatId: chatId.toString(), message });
        });
    }
    async report() {
        this.client.command('report', async (ctx) => {
            const chatId = ctx.chat?.id;
            const firstName = ctx.from?.first_name;
            const lastName = ctx.from?.last_name;
            const name = `<b>${firstName} ${lastName}</b>`;
            if (!(await this.chat.exists(chatId))) {
                this.sendMessage({
                    chatId: chatId.toString(),
                    message: `Olá, ${name}! Você não está cadastrado!\nPara se cadastrar digite /start`,
                });
                return;
            }
            await typescript_ioc_1.Container.get(bot_diff_gols_report_use_case_1.BotDiffGolsReportUseCase).sendPartialReport(chatId.toString());
        });
    }
    async forceEdit() {
        this.client.command('forceEdit', async (ctx) => {
            const chatId = ctx.chat?.id;
            const firstName = ctx.from?.first_name;
            const lastName = ctx.from?.last_name;
            const name = `<b>${firstName} ${lastName}</b>`;
            const chatDefault = this.config.telegramDefaultChatId;
            if (chatId.toString() != chatDefault) {
                this.sendMessage({
                    chatId: chatId.toString(),
                    message: `Olá, ${name}! Você não está autorizado a usar esse comando.`,
                });
                return;
            }
            await typescript_ioc_1.Container.get(bot_diff_gols_edit_message_use_case_1.BotDiffGolsEditMessageUseCase).process();
        });
    }
};
exports.TelegramBotDiffGolsRepository = TelegramBotDiffGolsRepository;
exports.TelegramBotDiffGolsRepository = TelegramBotDiffGolsRepository = __decorate([
    (0, typescript_ioc_1.Factory)(exports.repositoryRegisterStoryFactory),
    __param(0, typescript_ioc_1.Inject),
    __param(1, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [grammy_1.Bot,
        configurations_1.Configurations])
], TelegramBotDiffGolsRepository);
//# sourceMappingURL=telegram-bot-diff-gols-repository.js.map