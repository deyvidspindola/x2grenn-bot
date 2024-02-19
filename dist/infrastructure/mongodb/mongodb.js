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
exports.MongoDb = exports.repositoryRegisterStoryFactory = void 0;
const mongodb_1 = require("mongodb");
const typescript_ioc_1 = require("typescript-ioc");
const configurations_1 = require("../configuration/configurations");
const repositoryRegisterStoryFactory = () => {
    const config = typescript_ioc_1.Container.get(configurations_1.Configurations);
    const mongoDb = new mongodb_1.MongoClient(`${config.mongoDbDriver}://${config.mongoDbUsename}:${config.mongoDbPassword}@${config.mongoDbUri}/?retryWrites=true&w=majority`);
    return new MongoDb(mongoDb);
};
exports.repositoryRegisterStoryFactory = repositoryRegisterStoryFactory;
let MongoDb = class MongoDb {
    constructor(client) {
        this.client = client;
    }
    async connect() {
        try {
            await this.client.connect();
            console.log('Conectado ao MongoDB');
        }
        catch (error) {
            console.log(error);
        }
    }
    async getClient() {
        return this.client;
    }
};
exports.MongoDb = MongoDb;
exports.MongoDb = MongoDb = __decorate([
    (0, typescript_ioc_1.Factory)(exports.repositoryRegisterStoryFactory),
    __param(0, typescript_ioc_1.Inject),
    __metadata("design:paramtypes", [mongodb_1.MongoClient])
], MongoDb);
//# sourceMappingURL=mongodb.js.map