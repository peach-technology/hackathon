/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DepositAndExecuteResponse {
  type: string;
  position: Position;
  totalTokenIn: TotalTokenIn;
  totalSteps: TotalStep[];
}

interface Position {
  id: number;
  wallet: number;
  pool: number;
  updated_at: string;
  created_at: string;
  margin_buffer_max: number;
  margin_buffer_min: number;
  subaccount: string;
  tick_range_target: number;
  pool_price_lower: any;
  pool_price_upper: any;
  active: boolean;
}

interface TotalTokenIn {
  networkId: number;
  address: string;
  amount: string;
  amountUsd: string;
  amountRaw: string;
}

interface TotalStep {
  type: string;
  pool: Pool;
  tokenIn: TokenIn[];
  tokenOut?: TokenOut[];
}

interface Pool {
  networkId: number;
  address: string;
}

interface TokenIn {
  networkId?: number;
  address: string;
  amount?: string;
}

interface TokenOut {
  networkId: number;
  address: string;
  amount?: string;
}
