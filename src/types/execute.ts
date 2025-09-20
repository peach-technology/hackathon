export interface ExecuteParams extends Omit<ExecuteResponse, "status" | "activities"> {
  type: string;
  sender: string;
}

export interface ExecuteResponse {
  stepIndex: number;
  positionId: number;
  totalTokenIn: TotalTokenIn;
  totalSteps: TotalStep[];

  status: string;
  activities: Activity[];
}

export interface Activity {
  timestamp: string;
  type: string;
  activity: string;
  position: number;
  token: number;
  amount: number;
  value: number;
  network: number;
  hash: string;
}

export interface TotalStep {
  type: string;
  pool: Pool;
  tokenIn: TokenIn[];
  tokenOut?: TokenOut[];
}

export interface Pool {
  networkId: number;
  address: string;
}

export interface TokenIn {
  networkId?: number;
  address: string;
  amount?: string;
  amountUsd?: string;
  amountRaw?: string;
}

export interface TokenOut {
  networkId: number;
  address: string;
  amount?: string;
  amountUsd?: string;
  amountRaw?: string;
}

export interface TotalTokenIn {
  networkId: number;
  address: string;
  amount: string;
  amountUsd: string;
  amountRaw: string;
}
