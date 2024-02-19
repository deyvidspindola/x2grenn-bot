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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configurations = void 0;
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const typescript_ioc_1 = require("typescript-ioc");
const js_yaml_1 = require("js-yaml");
(0, dotenv_1.config)();
const configProivder = () => {
    const configFileName = `config/server-config.yml`;
    const config = (0, js_yaml_1.load)((0, fs_1.readFileSync)(configFileName, 'utf8'));
    return new Configurations(config);
};
let Configurations = class Configurations {
    constructor(config) {
        this.config = config;
    }
    /**
     * ENVIRONMENT
     */
    get environment() {
        return this.getEnvVariable(this.config.environment);
    }
    /**
     * MONDODB
     */
    get mongoDbDriver() {
        return this.getEnvVariable(this.config.mongodb.driver);
    }
    get mongoDbUri() {
        return this.getEnvVariable(this.config.mongodb.uri);
    }
    get mongoDbUsename() {
        return this.getEnvVariable(this.config.mongodb.username);
    }
    get mongoDbPassword() {
        return this.getEnvVariable(this.config.mongodb.password);
    }
    /**
     * TELEGRAM
     */
    get telegramDefaultChatId() {
        return this.getEnvVariable(this.config.telegram.defaultChatId);
    }
    /**
     * BET
     */
    get betUrl() {
        return this.getEnvVariable(this.config.bet.url);
    }
    get betApiUrl() {
        return this.getEnvVariable(this.config.bet.apiUrl);
    }
    /**
     * BOT DIFF GOLS
     */
    get mongoDbDiffGolsDatabase() {
        return this.getEnvVariable(this.config.mongodb.database.diffGols);
    }
    get telegramBotDiffGolsToken() {
        return this.getEnvVariable(this.config.telegram.bot.diffGols.token);
    }
    get betBotDiffGolsApiKey() {
        return this.getEnvVariable(this.config.bet.apiKey.diffGols);
    }
    /**
     * BOT WINS
     */
    get mongoDbWinsDatabase() {
        return this.getEnvVariable(this.config.mongodb.database.wins);
    }
    get telegramBotWinsToken() {
        return this.getEnvVariable(this.config.telegram.bot.wins.token);
    }
    get betBotWinsApiKey() {
        return this.getEnvVariable(this.config.bet.apiKey.wins);
    }
    getEnvVariable(value) {
        if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
            const envVariable = value.substring(2, value.length - 1);
            return process.env[envVariable];
        }
        return value;
    }
};
exports.Configurations = Configurations;
exports.Configurations = Configurations = __decorate([
    typescript_ioc_1.Singleton,
    (0, typescript_ioc_1.Factory)(configProivder),
    __metadata("design:paramtypes", [Object])
], Configurations);
//# sourceMappingURL=configurations.js.map