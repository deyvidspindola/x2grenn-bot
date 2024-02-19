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
exports.BetApi = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const configurations_1 = require("../configuration/configurations");
const axios_1 = __importDefault(require("axios"));
const bot_diff_gols_repository_1 = require("../../domain/bots/repository/bot-diff-gols-repository");
let BetApi = class BetApi {
    constructor(config, repository) {
        this.config = config;
        this.repository = repository;
        this.betApiKey = '';
    }
    async setApiKey(betApiKey) {
        this.betApiKey = betApiKey;
    }
    async getBetsInplay() {
        try {
            const options = {
                method: 'GET',
                url: `${this.config.betApiUrl}/inplay_filter`,
                params: { sport_id: '1' },
                headers: {
                    'X-RapidAPI-Key': this.betApiKey,
                    'X-RapidAPI-Host': 'betsapi2.p.rapidapi.com',
                },
            };
            const response = await axios_1.default.request(options);
            return response;
        }
        catch (error) {
            const message = `⚠️ <b>Erro:</b>\n Erro ao buscar bets inplay\nDetalhes:\n ${error.code}`;
            this.repository.sendMessage({
                chatId: this.config.telegramDefaultChatId,
                message,
            });
            console.log(error);
            throw error;
        }
    }
    async getEvents(event_id) {
        try {
            const options = {
                method: 'GET',
                url: `${this.config.betApiUrl}/event`,
                params: { FI: Number(event_id) },
                headers: {
                    'X-RapidAPI-Key': this.betApiKey,
                    'X-RapidAPI-Host': 'betsapi2.p.rapidapi.com',
                },
            };
            const response = await axios_1.default.request(options);
            return response;
        }
        catch (error) {
            const message = `⚠️ <b>Erro:</b>\n Erro ao buscar eventos\nDetalhes:\n ${error.code}`;
            this.repository.sendMessage({
                chatId: this.config.telegramDefaultChatId,
                message,
            });
            console.log(error);
            throw error;
        }
    }
};
exports.BetApi = BetApi;
exports.BetApi = BetApi = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __param(1, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [configurations_1.Configurations,
        bot_diff_gols_repository_1.BotDiffGolsRepository])
], BetApi);
//# sourceMappingURL=bet-api.js.map