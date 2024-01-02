import { Inject } from 'typescript-ioc';

import { MessageRepository } from '../domain/message-repository';
// import { ChatRepository } from '../domain/chat-repository';
// import { RequestsRepository } from '../domain/requests-repository';
import { Configurations } from '../infrastructure/configuration/configurations';
// import { Chat } from '../domain/entities/chat';

// let send = [];
// const diffs = {
//   8: 3,
//   10: 4,
//   12: 4,
// };
export class BotDiffGolsUseCase {
  constructor(
    @Inject
    private readonly configuration: Configurations,
    // @Inject
    // private readonly requests: RequestsRepository,
    // @Inject
    // private readonly chat: ChatRepository,
    @Inject
    private readonly message: MessageRepository,
  ) {}

  public async execute() {
    try {
      // const chats = await this.chat.chats();
      // if (!chats.length) {
      //   return;
      // }
      // const bets = await this.requests.execute('Esoccer');
      // for (const chat of chats) {
      await this.message.sendMessage({
        chatId: this.configuration.telegramDefaultChatId,
        message: `Hello, Deyvid!`,
      });
      // }
    } catch (error) {
      console.log(error);
    }
  }

  // private sendMessageDiffGols = async (bets: any, chats: Chat[]) => {
  //   for (const bet of bets) {
  //     if (bet && bet.ss && bet.time_status == 1) {
  //       const result = bet.ss.split('-');
  //       const numeroExtraido = this.extrairNumero(bet.league.name);
  //       const diff = Math.abs(parseInt(result[0]) - parseInt(result[1]));
  //       if (diff >= diffs[numeroExtraido] && !send.includes(bet.id)) {
  //         for (const chat of chats) {
  //           const message = `
  //           ${bet.league.name}\n
  //           ${bet.home.name} - ${bet.away.name}\n
  //           ${bet.time.status} ${bet.time.minute}'\n
  //           ${bet.scores.home} - ${bet.scores.away}\n
  //           Diferença de Gols: ${bet.scores.home - bet.scores.away}\n
  //           ${this.configuration.betUrl}${bet.ev_id}
  //           `;
  //           await this.message.sendMessage({
  //             chatId: chat.chatId.toString(),
  //             message,
  //           });
  //           send.push(bet.id);
  //         }
  //       }
  //     }
  //   }
  // };

  // private extrairNumero = (texto: string) => {
  //   const regex = /\b(\d+)\b/;
  //   const match = texto.match(regex);
  //   return match ? parseInt(match[1], 10) : null;
  // };
}
