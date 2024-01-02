"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const chat_repository_1 = require("../../domain/chat-repository");
const mongo_chat_repository_1 = require("../mongodb/repositories/mongo-chat-repository");
const message_repository_1 = require("../../domain/message-repository");
const telegram_message_repository_1 = require("../telegram/repositories/telegram-message-repository");
const configDevFile = () => yaml.load(fs.readFileSync('config/server-config.yml', 'utf8'));
exports.default = [
    { bindName: 'config', to: configDevFile() },
    { bind: message_repository_1.MessageRepository, to: telegram_message_repository_1.TelegramMessageRepository },
    { bind: chat_repository_1.ChatRepository, to: mongo_chat_repository_1.MongoChatRepository },
];
//# sourceMappingURL=ioc.config.js.map