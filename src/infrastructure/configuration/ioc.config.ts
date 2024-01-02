import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { ChatRepository } from '../../domain/chat-repository';
import { MongoChatRepository } from '../mongodb/repositories/mongo-chat-repository';
import { MessageRepository } from '../../domain/message-repository';
import { TelegramMessageRepository } from '../telegram/repositories/telegram-message-repository';
import { RequestsRepository } from '../../domain/requests-repository';
import { BetRequestsRepository } from '../bet/repositories/bet-requests-repository';

const configDevFile = () => yaml.load(fs.readFileSync('config/server-config.yml', 'utf8'));

export default [
  { bindName: 'config', to: configDevFile() },
  { bind: MessageRepository, to: TelegramMessageRepository },
  { bind: ChatRepository, to: MongoChatRepository },
  { bind: RequestsRepository, to: BetRequestsRepository },
];
