export interface Bet {
  betId: number;
  bet: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BetFilters {
  startDate: Date;
  endDate: Date;
}
