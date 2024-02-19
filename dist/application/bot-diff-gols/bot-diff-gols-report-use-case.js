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
exports.BotDiffGolsReportUseCase = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const bet_repository_1 = require("../../domain/bet-repository");
const configurations_1 = require("../../infrastructure/configuration/configurations");
const message_repository_1 = require("../../domain/message-repository");
const bot_diff_gols_repository_1 = require("../../domain/bots/repository/bot-diff-gols-repository");
const node_cron_1 = require("node-cron");
const utils_1 = require("../utils");
const chat_repository_1 = require("../../domain/chat-repository");
const moment_1 = __importDefault(require("moment"));
const diffgols_1 = require("../../domain/entities/enums/diffgols");
let BotDiffGolsReportUseCase = class BotDiffGolsReportUseCase {
    constructor(configuration, betRepository, message, botDiffGolsRepository, chat) {
        this.configuration = configuration;
        this.betRepository = betRepository;
        this.message = message;
        this.botDiffGolsRepository = botDiffGolsRepository;
        this.chat = chat;
        this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
        this.message.init(this.configuration.mongoDbDiffGolsDatabase);
        this.chat.init(this.configuration.mongoDbDiffGolsDatabase);
    }
    async execute() {
        (0, node_cron_1.schedule)('0 3 * * *', async () => {
            await this.sendReport();
        });
    }
    async sendReport() {
        try {
            const date = (0, utils_1._yesterday)();
            const process = await this.process(date);
            const chats = await this.chat.chats();
            const message = await this.messageReport(date, process, false);
            chats.map(async (chat) => {
                await this.botDiffGolsRepository.sendMessage({
                    chatId: chat.chatId.toString(),
                    message: message,
                });
            });
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    async sendPartialReport(chatId) {
        try {
            const date = (0, utils_1._today)();
            const process = await this.process(date);
            const message = await this.messageReport(date, process, true);
            this.botDiffGolsRepository.sendMessage({
                chatId: chatId.toString(),
                message: message,
            });
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    async process(date) {
        const filter = {
            startDate: (0, utils_1._startDate)(date),
            endDate: (0, utils_1._endDate)(date),
        };
        await this.betRepository.init(this.configuration.mongoDbDiffGolsDatabase);
        const betResults = await this.betRepository.bets(filter);
        const messages = await this.message.messages(filter);
        // Initialize counters for the reports
        let gamesLessThan3Goals8Mins = 0;
        let gamesLessThan4Goals10Mins = 0;
        let gamesLessThan4Goals12Mins = 0;
        let gamesLessThan2Goals8Mins = 0;
        let gamesLessThan3Goals10Mins = 0;
        let gamesLessThan3Goals12Mins = 0;
        for (const msg of messages) {
            const bet = betResults.find((b) => b.betId === msg.betId);
            if (!bet)
                continue;
            const betResult = JSON.parse(bet.bet);
            const diff = (0, utils_1.calcDiff)(betResult.ss, betResult.league.name).diff;
            if (betResult.league.name.includes('8 mins') && diff <= diffgols_1.DiffGols.EIGHT_MIN) {
                gamesLessThan3Goals8Mins++;
            }
            else if (betResult.league.name.includes('10 mins') && diff <= diffgols_1.DiffGols.TEN_MIN) {
                gamesLessThan4Goals10Mins++;
            }
            else if (betResult.league.name.includes('12 mins') && diff <= diffgols_1.DiffGols.TWELVE_MIN) {
                gamesLessThan4Goals12Mins++;
            }
            if (betResult.league.name.includes('8 mins') && diff <= diffgols_1.DiffGols.EIGHT_MIN - 1) {
                gamesLessThan2Goals8Mins++;
            }
            else if (betResult.league.name.includes('10 mins') && diff <= diffgols_1.DiffGols.TEN_MIN - 1) {
                gamesLessThan3Goals10Mins++;
            }
            else if (betResult.league.name.includes('12 mins') && diff <= diffgols_1.DiffGols.TWELVE_MIN - 1) {
                gamesLessThan3Goals12Mins++;
            }
        }
        return {
            betResults,
            messages,
            gamesLessThan3Goals8Mins,
            gamesLessThan4Goals10Mins,
            gamesLessThan4Goals12Mins,
            gamesLessThan2Goals8Mins,
            gamesLessThan3Goals10Mins,
            gamesLessThan3Goals12Mins,
        };
    }
    async messageReport(date, process, partial) {
        let message = '';
        const dt = (0, moment_1.default)(date).format('DD/MM/YYYY');
        if (partial) {
            message = `
      *************************************
      <i>Esse é um relatório parcial do dia: <b>${dt}</b>.
      Lembrando que o relatório é enviado todos os dias às 00:00. Com todos os jogos do dia anterior.</i>
      *************************************
      .
      .`;
        }
        message =
            message +
                `
    Relatório de <b>${dt}</b>
    .
    <b>TOTAL DE JOGOS</b>
    ----------------------------------
    8 minutos: <b>${process.betResults.filter((b) => b.bet.includes('8 mins')).length}</b>
    10 minutos: <b>${process.betResults.filter((b) => b.bet.includes('10 mins')).length}</b>
    12 minutos: <b>${process.betResults.filter((b) => b.bet.includes('12 mins')).length}</b>
    Total: <b>${process.betResults.length}</b>
    .
    <b>JOGOS ENVIADOS</b>
    ----------------------------------
    8 minutos: <b>${process.messages.filter((m) => m.message.includes('8 mins')).length}</b>
    10 minutos: <b>${process.messages.filter((m) => m.message.includes('10 mins')).length}</b>
    12 minutos: <b>${process.messages.filter((m) => m.message.includes('12 mins')).length}</b>
    Total: <b>${process.messages.length}</b>
    .
    <b>JOGOS</b>
    ----------------------------------
    8 minutos menor ou igual a ${diffgols_1.DiffGols.EIGHT_MIN} gols: <b>${process.gamesLessThan3Goals8Mins}</b>
    10 minutos menor ou igual a ${diffgols_1.DiffGols.TEN_MIN} gols: <b>${process.gamesLessThan4Goals10Mins}</b>
    12 minutos menor ou igual a ${diffgols_1.DiffGols.TWELVE_MIN} gols: <b>${process.gamesLessThan4Goals12Mins}</b>
    Total: <b>${process.gamesLessThan3Goals8Mins + process.gamesLessThan4Goals10Mins + process.gamesLessThan4Goals12Mins}</b>
    ----------------------------------
    8 minutos menor ou igual a ${diffgols_1.DiffGols.EIGHT_MIN - 1} gols: <b>${process.gamesLessThan2Goals8Mins}</b>
    10 minutos menor ou igual a ${diffgols_1.DiffGols.TEN_MIN - 1} gols: <b>${process.gamesLessThan3Goals10Mins}</b>
    12 minutos menor ou igual a ${diffgols_1.DiffGols.TWELVE_MIN - 1} gols: <b>${process.gamesLessThan3Goals12Mins}</b>
    Total: <b>${process.gamesLessThan2Goals8Mins + process.gamesLessThan3Goals10Mins + process.gamesLessThan3Goals12Mins}</b>
    `;
        return message.replace(/^\s+/gm, '');
    }
};
exports.BotDiffGolsReportUseCase = BotDiffGolsReportUseCase;
exports.BotDiffGolsReportUseCase = BotDiffGolsReportUseCase = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __param(1, typescript_ioc_1.Inject),
    __param(2, typescript_ioc_1.Inject),
    __param(3, typescript_ioc_1.Inject),
    __param(4, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [configurations_1.Configurations,
        bet_repository_1.BetRepository,
        message_repository_1.MessageRepository,
        bot_diff_gols_repository_1.BotDiffGolsRepository,
        chat_repository_1.ChatRepository])
], BotDiffGolsReportUseCase);
//# sourceMappingURL=bot-diff-gols-report-use-case.js.map