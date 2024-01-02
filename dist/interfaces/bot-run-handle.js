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
exports.BotRunHandle = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const node_cron_1 = require("node-cron");
const bot_use_case_1 = require("../application/bot-use-case");
let BotRunHandle = class BotRunHandle {
    constructor(bot) {
        this.bot = bot;
    }
    async run() {
        (0, node_cron_1.schedule)('*/3 * * * * *', () => {
            this.bot.execute();
        });
    }
    async run2() {
        (0, node_cron_1.schedule)('*/5 * * * * *', () => {
            this.bot.execute();
        });
    }
};
exports.BotRunHandle = BotRunHandle;
exports.BotRunHandle = BotRunHandle = __decorate([
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [bot_use_case_1.Bot])
], BotRunHandle);
//# sourceMappingURL=bot-run-handle.js.map