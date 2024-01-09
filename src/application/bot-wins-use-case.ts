import { Inject } from 'typescript-ioc';

import { ChatRepository } from '../domain/chat-repository';
import { RequestsRepository } from '../domain/requests-repository';
import { Configurations } from '../infrastructure/configuration/configurations';
import { Chat } from '../domain/entities/chat';
import { MessageRepository } from '../domain/message-repository';
import { Messages } from '../domain/entities/message';
import { BotWinsRepository } from '../domain/bots/repository/bot-wins-repository';
import { BetRepository } from '../domain/bet-repository';
import { _todayNow } from './utils';

let send = [];
const diffs = {
  8: 3,
  10: 4,
  12: 4,
};
export class BotWinsUseCase {
  constructor(
    @Inject
    private readonly configuration: Configurations,
    @Inject
    private readonly requests: RequestsRepository,
    @Inject
    private readonly botWinsRepository: BotWinsRepository,
    @Inject
    private readonly chat: ChatRepository,
    @Inject
    private readonly message: MessageRepository,
    @Inject
    private readonly betRepository: BetRepository,
  ) {
    this.chat.init(this.configuration.mongoDbWinsDatabase);
    this.message.init(this.configuration.mongoDbWinsDatabase);
    this.betRepository.init(this.configuration.mongoDbWinsDatabase);
    this.requests.setApiKey(this.configuration.betBotWinsApiKey);
  }

  public async execute() {
    try {
      const chats = await this.chat.chats();
      if (!chats.length) return;
      const bets = await this.requests.execute('Esoccer');
      this.sendMessageDiffGols(bets, chats);
      this.saveBets(bets);
    } catch (error) {
      console.log(error);
    }
  }

  private sendMessageDiffGols = async (bets: any, chats: Chat[]) => {
    for (const bet of bets) {
      if (bet && bet.ss && bet.time_status == 1) {
        const result = bet.ss.split('-');
        const numeroExtraido = this.extrairNumero(bet.league.name);
        const diff = Math.abs(parseInt(result[0]) - parseInt(result[1]));
        if (diff >= diffs[numeroExtraido] && !send.includes(bet.id)) {
          const league = `<b>${bet.league.name}</b>`;
          const home = this.formatTeam(bet.home.name);
          const away = this.formatTeam(bet.away.name);
          const title = `${home} <b>${bet.ss}</b> ${away}`;
          const message = `${league}\n${title}\n<b>Diferença de gols</b>: ${diff}\n${this.configuration.betUrl}${bet.ev_id}`;
          this.sendMessage(message, chats, bet);
          // send.push(bet.id);
        }
      }
    }
  };

  private async sendMessage(message: string, chats: Chat[], bet: any) {
    let msgId: any[],
      chatId = [];
    for (const chat of chats) {
      const msg = await this.botWinsRepository.sendMessage({
        chatId: chat.chatId.toString(),
        message,
      });
      chatId.push(chat.chatId);
      msgId.push(msg.message_id);
    }
    await this.message.save({
      messageId: JSON.stringify(msgId),
      chatId: JSON.stringify(chatId),
      betId: bet.id,
      eventId: bet.ev_id,
      message: message,
      createdAt: _todayNow(),
    } as Messages);
  }

  private saveBets(bets: any) {
    for (const bet of bets) {
      this.betRepository.save({
        betId: bet.id,
        bet: JSON.stringify(bet),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  private extrairNumero = (texto: string) => {
    const regex = /\b(\d+)\b/;
    const match = texto.match(regex);
    return match ? parseInt(match[1], 10) : null;
  };

  private formatTeam(team: string) {
    const formattedName = team.replace(/\(([^)]+)\)/, (_, name) => `(<b>${name}</b>)`);
    const newTeam = formattedName.replace(' Esports', '');
    return newTeam;
  }
}
