export interface Bet {
  betId: number;
  bet: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BetFilters {
  betId?: string;
  startDate: Date;
  endDate: Date;
}
