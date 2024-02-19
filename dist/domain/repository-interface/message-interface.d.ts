import { Messages } from '../entities/message';
export interface MessageInterface {
    init(database: string): Promise<any>;
    save(message: Messages): Promise<any>;
    messages(filters?: any): Promise<Messages[]>;
    removeMessages(): Promise<any>;
}
