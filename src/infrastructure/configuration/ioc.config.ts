import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { ChatRepository } from '../../domain/chat-repository';
import { MongoChatRepository } from '../mongodb/repositories/mongo-chat-repository';
import { RequestsRepository } from '../../domain/requests-repository';
import { BetRequestsRepository } from '../bet/repositories/bet-requests-repository';
import { TelegramBotDiffGolsRepository } from '../telegram/repositories/telegram-bot-diff-gols-repository';
import { MessageRepository } from '../../domain/message-repository';
import { MongoMessageRepository } from '../mongodb/repositories/mongo-message-repository';
import { BotDiffGolsRepository } from '../../domain/bots/repository/bot-diff-gols-repository';
import { BetRepository } from '../../domain/bet-repository';
import { MongoBetRepository } from '../mongodb/repositories/mongo-bet-repository';

const configDevFile = () => yaml.load(fs.readFileSync('config/server-config.yml', 'utf8'));

export default [
  { bindName: 'config', to: configDevFile() },
  { bind: BotDiffGolsRepository, to: TelegramBotDiffGolsRepository },
  { bind: ChatRepository, to: MongoChatRepository },
  { bind: MessageRepository, to: MongoMessageRepository },
  { bind: RequestsRepository, to: BetRequestsRepository },
  { bind: BetRepository, to: MongoBetRepository },
];
