export enum Config {
  IncrementString = "increment",
  DecrementString = "decrement",
  ConstantString = "constant",
  SectorString = "sector",
  StockString = "stock",
  EventString = "event",
  NoEventString = "noevent",
  Boom = "boom",
  Bust = "bust",
  ProfitWarning = "ProfitWarning",
  Takeover = "takeover",
  Scandal = "scandal",
  TrendsIncrementWeight = 1,
  TrendsDecrementWeight = 1,
  TrendsConstantWeight = 2,
  MarketTrendFluctuation = 1,
  EventsSectorWeight = 33,
  EventsStockWeight = 67,
  EventsSectorBoomWeight = 1,
  EventsSectorBustWeight = 1,
  EventsStockProfitWarningWeight = 2,
  EventsStockTakeoverWeight = 1,
  EventsStockScandalWeight = 1,
  Rounds = 20,
  InitialStockPrice = 100,
}
