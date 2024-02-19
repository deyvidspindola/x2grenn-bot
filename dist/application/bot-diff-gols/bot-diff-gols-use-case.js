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
exports.BotDiffGolsUseCase = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const node_cron_1 = require("node-cron");
const chat_repository_1 = require("../../domain/chat-repository");
const requests_repository_1 = require("../../domain/requests-repository");
const configurations_1 = require("../../infrastructure/configuration/configurations");
const message_repository_1 = require("../../domain/message-repository");
const bot_diff_gols_repository_1 = require("../../domain/bots/repository/bot-diff-gols-repository");
const bet_repository_1 = require("../../domain/bet-repository");
const utils_1 = require("../utils");
let send = [];
let BotDiffGolsUseCase = class BotDiffGolsUseCase {
    constructor(configuration, requests, botDiffGolsRepository, chat, message, betRepository) {
        this.configuration = configuration;
        this.requests = requests;
        this.botDiffGolsRepository = botDiffGolsRepository;
        this.chat = chat;
        this.message = message;
        this.betRepository = betRepository;
        this.sendMessageDiffGols = async (bets, chats) => {
            await Promise.all(bets.map(async (bet) => {
                if (this.shouldSendMessage(bet)) {
                    await this.sendMessageToChats(chats, bet);
                    send.push(bet.id);
                }
            }));
        };
    }
    async execute() {
        await this.initialize();
        await this.startBot();
    }
    async initialize() {
        await this.botDiffGolsRepository.start();
        await this.botDiffGolsRepository.sendMessage({
            chatId: this.configuration.telegramDefaultChatId,
            message: 'Bot Diff Gols is running',
        });
        this.initRepositories();
    }
    initRepositories() {
        this.chat.init(this.configuration.mongoDbDiffGolsDatabase);
        this.message.init(this.configuration.mongoDbDiffGolsDatabase);
        this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
        this.requests.setApiKey(this.configuration.betBotDiffGolsApiKey);
    }
    async startBot() {
        (0, node_cron_1.schedule)('*/2 * * * * *', async () => {
            await this.process();
        });
        (0, node_cron_1.schedule)('0 * * * * *', async () => {
            const lastbets = send.slice(-10);
            send = [];
            send.push(...lastbets);
        });
    }
    async process() {
        try {
            const chats = await this.chat.cacheChats();
            if (!chats.length)
                return;
            const bets = await this.requests.execute('Esoccer');
            this.sendMessageDiffGols(bets, chats);
            this.saveBets(bets);
        }
        catch (error) {
            console.log(error);
        }
    }
    shouldSendMessage(bet) {
        if (!bet || !bet.ss || bet.time_status != 1) {
            return false;
        }
        const diff = (0, utils_1.calcDiff)(bet.ss, bet.league.name);
        return !send.includes(bet.id) && diff.result;
    }
    async createMessage(bet) {
        const league = `<b>${bet.league.name}</b>`;
        const home = (0, utils_1.formatTeam)(bet.home.name);
        const away = (0, utils_1.formatTeam)(bet.away.name);
        const title = `${home} <b>${bet.ss.replace('-', ' x ')}</b> ${away}`;
        const { sum } = (0, utils_1.calcDiff)(bet.ss, bet.league.name);
        const gol = await this.getLastGoal(bet.id, sum);
        const url = `${this.configuration.betUrl}${bet.ev_id}`;
        const message = `${league}\n${title}\n${gol}\n${url}`;
        return message;
    }
    async sendMessageToChats(chats, bet) {
        const message = await this.createMessage(bet);
        const sentMessages = await Promise.all(chats.map(async (chat) => {
            try {
                const msg = await this.botDiffGolsRepository.sendMessage({
                    chatId: chat.chatId.toString(),
                    message,
                });
                return msg.message_id;
            }
            catch (error) {
                return null;
            }
        }));
        await this.saveMessages(sentMessages, chats, bet, message);
    }
    async saveMessages(messageIds, chats, bet, message) {
        const validMessageIds = messageIds.filter((id) => id !== null);
        const chatIds = chats.map((chat) => chat.chatId);
        await this.message.save({
            messageId: JSON.stringify(validMessageIds),
            chatId: JSON.stringify(chatIds),
            betId: bet.id,
            eventId: bet.ev_id,
            message: message,
            createdAt: (0, utils_1._todayNow)(),
            edited: false,
        });
    }
    saveBets(bets) {
        for (const bet of bets) {
            this.betRepository.save({
                betId: bet.id,
                bet: JSON.stringify(bet),
                createdAt: (0, utils_1._todayNow)(),
                updatedAt: (0, utils_1._todayNow)(),
            });
        }
    }
    async getLastGoal(game_id, sum) {
        try {
            const events = await this.requests.events(game_id);
            if (!events.length) {
                return undefined;
            }
            const [minute, goalInfo, team] = events.split('-').map((item) => item.trim());
            const goalRegex = /(\d+)(?:st|nd|rd|th)?/;
            const goalNumberMatch = goalInfo.match(goalRegex);
            if (!goalNumberMatch) {
                return undefined;
            }
            let goalNumber = goalNumberMatch[1];
            if (goalNumber < sum) {
                goalNumber = sum;
            }
            const Team = (0, utils_1.formatTeam)(team.replace(/^\((.*)\)$/, '$1'));
            const formattedGoal = `⚽️  <b>${minute}</b> - ${goalNumber}º Gol - ${Team}`;
            return formattedGoal;
        }
        catch (error) {
            return undefined;
        }
    }
};
exports.BotDiffGolsUseCase = BotDiffGolsUseCase;
exports.BotDiffGolsUseCase = BotDiffGolsUseCase = __decorate([
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
], BotDiffGolsUseCase);
//# sourceMappingURL=bot-diff-gols-use-case.js.map