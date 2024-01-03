import { Inject } from 'typescript-ioc';

import { ChatRepository } from '../domain/chat-repository';
import { BotDiffGolsRepository } from '../domain/bot-diff-gols-repository';
import { RequestsRepository } from '../domain/requests-repository';
import { Configurations } from '../infrastructure/configuration/configurations';
import { Chat } from '../domain/entities/chat';
import { MessageRepository } from '../domain/message-repository';
import { Messages } from '../domain/entities/message';

let send = [];
const diffs = {
  8: 3,
  10: 4,
  12: 4,
};
export class BotDiffGolsUseCase {
  constructor(
    @Inject
    private readonly configuration: Configurations,
    @Inject
    private readonly requests: RequestsRepository,
    @Inject
    private readonly botDiffGolsRepository: BotDiffGolsRepository,
    @Inject
    private readonly chat: ChatRepository,
    @Inject
    private readonly message: MessageRepository,
  ) {}

  public async execute() {
    try {
      const chats = await this.chat.chats(this.configuration.mongoDbDatabase);
      if (!chats.length) return;
      const bets = await this.requests.execute('Esoccer');
      this.sendMessageDiffGols(bets, chats);
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
          const title = `${bet.home.name.replace(' Esports', '')} ${bet.ss} ${bet.away.name.replace(' Esports', '')}`;
          const message = `${league}\n${title}\n<b>Diferença de gols</b>: ${diff}\n${this.configuration.betUrl}${bet.ev_id}`;
          this.sendMessage(message, chats, bet);
          send.push(bet.id);
        }
      }
    }
  };

  private async sendMessage(message: string, chats: Chat[], bet: any) {
    for (const chat of chats) {
      const msg = await this.botDiffGolsRepository.sendMessage({
        chatId: chat.chatId.toString(),
        message,
      });
      await this.message.save(
        {
          messageId: msg.message_id,
          chatId: chat.chatId,
          gameId: bet.id,
          eventId: bet.ev_id,
          message: message,
          createdAt: new Date(),
        } as Messages,
        this.configuration.mongoDbDatabase,
      );
    }
  }

  private extrairNumero = (texto: string) => {
    const regex = /\b(\d+)\b/;
    const match = texto.match(regex);
    return match ? parseInt(match[1], 10) : null;
  };
}
