import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { SendMessage } from '../../domain/send-message';
import { TelegramSendMessage } from '../telegram/repositories/telegram-send-message';

const configDevFile = () => yaml.load(fs.readFileSync('config/server-config.yml', 'utf8'));

export default [
  { bindName: 'config', to: configDevFile() },
  { bind: SendMessage, to: TelegramSendMessage },
];
