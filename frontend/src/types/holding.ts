export interface Holding {
  id: string;
  ticker: string;
  name: string;
  value: number;
}

export type HoldingInput = Omit<Holding, "id">;
