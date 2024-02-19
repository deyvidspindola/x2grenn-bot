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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotDiffGolsEditMessageUseCase = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const node_cron_1 = require("node-cron");
const chat_repository_1 = require("../../domain/chat-repository");
const requests_repository_1 = require("../../domain/requests-repository");
const configurations_1 = require("../../infrastructure/configuration/configurations");
const message_repository_1 = require("../../domain/message-repository");
const bot_diff_gols_repository_1 = require("../../domain/bots/repository/bot-diff-gols-repository");
const bet_repository_1 = require("../../domain/bet-repository");
const utils_1 = require("../utils");
const moment_1 = __importDefault(require("moment"));
let BotDiffGolsEditMessageUseCase = class BotDiffGolsEditMessageUseCase {
    constructor(configuration, requests, botDiffGolsRepository, chat, message, betRepository) {
        this.configuration = configuration;
        this.requests = requests;
        this.botDiffGolsRepository = botDiffGolsRepository;
        this.chat = chat;
        this.message = message;
        this.betRepository = betRepository;
        this.chat.init(this.configuration.mongoDbDiffGolsDatabase);
        this.message.init(this.configuration.mongoDbDiffGolsDatabase);
        this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
        this.requests.setApiKey(this.configuration.betBotDiffGolsApiKey);
    }
    async execute() {
        (0, node_cron_1.schedule)('*/5 * * * * *', async () => {
            await this.process();
        });
    }
    async process() {
        const filter = {
            startDate: (0, utils_1._startDate)((0, utils_1._today)()),
            endDate: (0, utils_1._endDate)((0, utils_1._today)()),
        };
        const messages = await this.message.cacheMessages({ ...filter, edited: false });
        for (const msg of messages) {
            try {
                const messageId = JSON.parse(msg.messageId);
                const chatId = JSON.parse(msg.chatId);
                const bet = await this.betRepository.bets({ ...filter, betId: msg.betId.toString() });
                if (!bet.length)
                    continue;
                if ((0, moment_1.default)().diff((0, moment_1.default)(bet[0].updatedAt), 'seconds') > 10810) {
                    const result = JSON.parse(bet[0].bet);
                    const diff = (0, utils_1.calcDiff)(result.ss, result.league.name).diff;
                    const home = (0, utils_1.formatTeam)(result.home.name);
                    const away = (0, utils_1.formatTeam)(result.away.name);
                    let message = msg.message;
                    message =
                        message +
                            `
          ------------------------------------
          <b>** FIM DE JOGO **</b>
          ${home} <b>${result.ss.replace('-', ' x ')}</b> ${away}
          <b>Gols de diferença</b>: ${diff}
          `;
                    for (let i = 0; i < messageId.length; i++) {
                        await this.botDiffGolsRepository.editMessage({
                            chatId: chatId[i],
                            messageId: messageId[i],
                            message: message.replace(/^\s+/gm, ''),
                        });
                    }
                    await this.message.update(msg._id);
                }
            }
            catch (error) {
                continue;
            }
        }
    }
};
exports.BotDiffGolsEditMessageUseCase = BotDiffGolsEditMessageUseCase;
exports.BotDiffGolsEditMessageUseCase = BotDiffGolsEditMessageUseCase = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __param(1, typescript_ioc_1.Inject),
    __param(2, typescript_ioc_1.Inject),
    __param(3, typescript_ioc_1.Inject),
    __param(4, typescript_ioc_1.Inject),
    __param(5, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [configurations_1.Configurations,
        requests_repository_1.RequestsRepository,
        bot_diff_gols_repository_1.BotDiffGolsRepository,
        chat_repository_1.ChatRepository,
        message_repository_1.MessageRepository,
        bet_repository_1.BetRepository])
], BotDiffGolsEditMessageUseCase);
//# sourceMappingURL=bot-diff-gols-edit-message-use-case.js.map