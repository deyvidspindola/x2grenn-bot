"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetApi = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const configurations_1 = require("../configuration/configurations");
const axios_1 = __importDefault(require("axios"));
class BetApi {
    constructor() { }
    async getBetsInplay(league) {
        const config = typescript_ioc_1.Container.get(configurations_1.Configurations);
        const url = `${config.betApiUrl}/v1/bet365/inplay_filter?sport_id=1&token=${config.betApiKey}`;
        const response = await axios_1.default.get(url);
        return response.data.results.filter((game) => game.league.name.includes(league));
    }
}
exports.BetApi = BetApi;
//# sourceMappingURL=bet-api.js.map