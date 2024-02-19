"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const ioc_config_1 = __importDefault(require("./infrastructure/configuration/ioc.config"));
const mongodb_1 = require("./infrastructure/mongodb/mongodb");
const bot_run_handle_1 = require("./interfaces/bot-run-handle");
typescript_ioc_1.Container.configure(...ioc_config_1.default);
typescript_ioc_1.Container.namespace(process.env.NODE_ENV || 'development');
const handler = async () => {
    await typescript_ioc_1.Container.get(mongodb_1.MongoDb).connect();
    await typescript_ioc_1.Container.get(bot_run_handle_1.BotRunHandle).runBotDiffGols();
};
exports.handler = handler;
(0, exports.handler)();
//# sourceMappingURL=index.js.map