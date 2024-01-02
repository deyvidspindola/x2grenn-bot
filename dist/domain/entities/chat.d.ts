import { ChatStatus } from './enums/chat-status';
export interface Chat {
    id?: string;
    firstName: string;
    lastName: string;
    chatId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    status: ChatStatus;
}
export interface GetChat {
    chatId: number;
}
