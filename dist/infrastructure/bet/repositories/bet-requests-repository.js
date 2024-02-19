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
exports.BetRequestsRepository = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const bet_api_1 = require("../bet-api");
const diffgols_1 = require("../../../domain/entities/enums/diffgols");
let BetRequestsRepository = class BetRequestsRepository {
    constructor(betApi) {
        this.betApi = betApi;
    }
    async setApiKey(apiKey) {
        await this.betApi.setApiKey(apiKey);
    }
    async execute(league) {
        const response = await this.betApi.getBetsInplay();
        return response.data.results.filter((game) => game.league.name.includes(league));
    }
    async events(event_id) {
        const response = await this.betApi.getEvents(event_id);
        const data = response.data.results[0].filter((event) => event.type === 'ST' && event.IC === diffgols_1.EventSTTypes.GOLS);
        return data[0].LA;
    }
};
exports.BetRequestsRepository = BetRequestsRepository;
exports.BetRequestsRepository = BetRequestsRepository = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [bet_api_1.BetApi])
], BetRequestsRepository);
//# sourceMappingURL=bet-requests-repository.js.map