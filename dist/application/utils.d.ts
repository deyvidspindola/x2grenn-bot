import { DiffGols } from '../domain/entities/enums/diffgols';
export declare const extrairNumero: (texto: string) => number;
export declare const formatTeam: (team: string) => string;
export declare const _diff: (gameTime: number) => DiffGols;
export declare const calcDiff: (ss: string, game: string) => {
    sum: number;
    diff: number;
    result: boolean;
};
export declare const _today: (type?: string) => string;
export declare const _todayNow: () => Date;
export declare const _yesterday: (type?: string) => string;
export declare const _startDate: (data: string) => Date;
export declare const _endDate: (data: string) => Date;
