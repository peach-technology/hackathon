import axios from "@/lib/axios";
import type { ExecuteParams, ExecuteResponse } from "@/types/execute";
import type { getDepositQuoteForm, getDepositQuoteResponse } from "@/types/getDeposit";
import { useMutation } from "@tanstack/react-query";

// 실제 API 호출을 시뮬레이션하는 delay 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useGetDepositQuoteMutation = () => {
  return useMutation({
    mutationFn: async (params: getDepositQuoteForm) => {
      const res = await axios.post<getDepositQuoteResponse>("/positions", {
        method: "getDepositQuote",
        params,
      });
      return res.data;
    },
  });
};

export const useDepositMutation = () => {
  return useMutation({
    mutationFn: async (params: getDepositQuoteForm) => {
      // const res = await axios.post<DepositAndExecuteResponse>("/positions", {
      //   method: "deposit",
      //   params,
      // });
      // return res.data;

      console.log("Deposit Mock Request:", {
        method: "deposit",
        params,
      });

      // API 호출 시뮬레이션 (500ms 지연)
      await delay(500);

      console.log("Deposit Mock Response:", MOCK_DEPOSIT_RESPONSE);
      return MOCK_DEPOSIT_RESPONSE;
    },
  });
};

export const useExecuteMutation = () => {
  return useMutation({
    mutationFn: async (params: ExecuteParams) => {
      // const res = await axios.post<DepositAndExecuteResponse>("/positions", {
      //   method: "execute",
      //   params,
      // });
      // return res.data;

      const stepIndex = params.stepIndex;

      console.log(`Execute Mock Request (Step ${stepIndex}):`, {
        method: "execute",
        params,
      });

      // API 호출 시뮬레이션 (1초 지연)
      await delay(1000);

      const response = MOCK_EXECUTE_RESPONSES[stepIndex as keyof typeof MOCK_EXECUTE_RESPONSES] as ExecuteResponse;

      if (!response) {
        throw new Error(`No mock data found for step ${stepIndex}`);
      }

      console.log(`Execute Mock Response (Step ${stepIndex}):`, response);
      return response;
    },
  });
};

// Mock 데이터 정의
const MOCK_DEPOSIT_RESPONSE = {
  type: "deposit",
  position: {
    id: 11,
    wallet: 5,
    pool: 1,
    updated_at: "2025-09-19T10:53:33.322414+00:00",
    created_at: "2025-09-19T10:53:33.322414+00:00",
    margin_buffer_max: 0.4,
    margin_buffer_min: 0.2,
    subaccount: "0x206064c83fc8f0fcc00e705e49f7a2d32890f040",
    tick_range_target: 1000,
    pool_price_lower: null,
    pool_price_upper: null,
    active: false,
  },
  totalTokenIn: {
    networkId: 130,
    address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
    amount: "100",
    amountUsd: "100000000",
    amountRaw: "100000000",
  },
  totalSteps: [
    {
      type: "depositMargin",
      pool: {
        networkId: 130,
        address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
      },
      tokenIn: [
        {
          networkId: 130,
          address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
          amount: "13.793103",
        },
      ],
      tokenOut: [
        {
          networkId: 1337,
          address: "0x00000000000000000000000000000000",
          amount: "13.761201",
        },
      ],
    },
    {
      type: "swap",
      pool: {
        networkId: 130,
        address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
      },
      tokenIn: [
        {
          networkId: 130,
          address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
        },
      ],
      tokenOut: [
        {
          networkId: 130,
          address: "0x4200000000000000000000000000000000000006",
        },
      ],
    },
    {
      type: "depositPool",
      pool: {
        networkId: 130,
        address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
      },
      tokenIn: [
        {
          address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
        },
        {
          address: "0x4200000000000000000000000000000000000006",
        },
      ],
    },
  ],
};

// Execute 단계별 Mock 응답들
const MOCK_EXECUTE_RESPONSES = {
  0: {
    positionId: 12,
    stepIndex: 0,
    status: "success",
    activities: [
      {
        timestamp: "2025-09-19T12:01:20.518Z",
        type: "wallet",
        activity: "send",
        position: 12,
        token: 2,
        amount: 1.37931,
        value: 1.37931,
        network: 130,
        hash: "0xbaa3b52239e2a5626e0f36a8c96194a838d336110db7c99291d6f740e2d78ab1",
      },
      {
        timestamp: "2025-09-19T12:01:20.518Z",
        type: "perpetuals",
        activity: "deposit",
        position: 12,
        token: 22,
        amount: 1.353616,
        value: 1.353616,
        network: 1337,
        hash: "0xa124e92aef4bb200a29e042bd92db302032d00108a4ed0d244ed947dae4f8beb",
      },
    ],
    totalSteps: [
      {
        type: "depositMargin",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amount: "1.37931",
            amountUsd: "1.37931",
            amountRaw: "1379310",
          },
        ],
        tokenOut: [
          {
            networkId: 1337,
            address: "0x00000000000000000000000000000000",
            amount: "1.353616",
            amountUsd: "1.353616",
            amountRaw: "135361600",
          },
        ],
      },
      {
        type: "swap",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amountRaw: "4310345",
          },
        ],
        tokenOut: [
          {
            networkId: 130,
            address: "0x4200000000000000000000000000000000000006",
          },
        ],
      },
      {
        type: "depositPool",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
          },
          {
            address: "0x4200000000000000000000000000000000000006",
          },
        ],
      },
    ],
    totalTokenIn: {
      networkId: 130,
      address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
      amount: "10",
      amountUsd: "10",
      amountRaw: "10000000",
    },
  },
  1: {
    positionId: 12,
    stepIndex: 1,
    status: "success",
    activities: [
      {
        timestamp: "2025-09-19T12:05:21.407Z",
        type: "wallet",
        activity: "sell",
        position: 12,
        token: 2,
        amount: 4.310345,
        value: 4.310345,
        network: 130,
        hash: "0x6feb5c1a7472d52f2e28585ab1cd1ab9bd57308c386fdafdbf849e543ae0d77f",
      },
      {
        timestamp: "2025-09-19T12:05:21.407Z",
        type: "wallet",
        activity: "buy",
        position: 12,
        token: 1,
        amount: 0.000953578951653899,
        value: 4.30569504040285,
        network: 130,
      },
    ],
    totalSteps: [
      {
        type: "depositMargin",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amount: "1.37931",
            amountUsd: "1.37931",
            amountRaw: "1379310",
          },
        ],
        tokenOut: [
          {
            networkId: 1337,
            address: "0x00000000000000000000000000000000",
            amount: "1.353616",
            amountUsd: "1.353616",
            amountRaw: "135361600",
          },
        ],
      },
      {
        type: "swap",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amountRaw: "4310345",
            amount: "4.310345",
            amountUsd: "4.310345",
          },
        ],
        tokenOut: [
          {
            networkId: 130,
            address: "0x4200000000000000000000000000000000000006",
            amount: "0.000953578951653899",
            amountUsd: "4.30569504040285",
            amountRaw: "953578951653899",
          },
        ],
      },
      {
        type: "depositPool",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            address: "0x4200000000000000000000000000000000000006",
            amountRaw: "953578951653899",
          },
          {
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amountRaw: "4310345",
          },
        ],
      },
    ],
    totalTokenIn: {
      networkId: 130,
      address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
      amount: "10",
      amountUsd: "10",
      amountRaw: "10000000",
    },
  },
  2: {
    positionId: 12,
    stepIndex: 2,
    status: "success",
    activities: [
      {
        timestamp: "2025-09-19T13:38:45.072Z",
        type: "pool",
        activity: "deposit",
        position: 12,
        token: 2,
        amount: -4.085666,
        value: -4.085666,
        network: 130,
        hash: "0x95f78dd01787e095a73e74f1a1cc7b4a5d15bde392b11ec1a32b4ce186b8c258",
      },
      {
        timestamp: "2025-09-19T13:38:45.074Z",
        type: "pool",
        activity: "deposit",
        position: 12,
        token: 1,
        amount: -0.000953578951653273,
        value: -4.31027221936796,
        network: 130,
        hash: "0x95f78dd01787e095a73e74f1a1cc7b4a5d15bde392b11ec1a32b4ce186b8c258",
      },
    ],
    totalSteps: [
      {
        type: "depositMargin",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amount: "1.37931",
            amountUsd: "1.37931",
            amountRaw: "1379310",
          },
        ],
        tokenOut: [
          {
            networkId: 1337,
            address: "0x00000000000000000000000000000000",
            amount: "1.353616",
            amountUsd: "1.353616",
            amountRaw: "135361600",
          },
        ],
      },
      {
        type: "swap",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amountRaw: "4310345",
            amount: "4.310345",
            amountUsd: "4.310345",
          },
        ],
        tokenOut: [
          {
            networkId: 130,
            address: "0x4200000000000000000000000000000000000006",
            amount: "0.000953578951653899",
            amountUsd: "4.30569504040285",
            amountRaw: "953578951653899",
          },
        ],
      },
      {
        type: "depositPool",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amountRaw: "-4085666",
            amount: "-4.085666",
            amountUsd: "-4.085666",
          },
          {
            networkId: 130,
            address: "0x4200000000000000000000000000000000000006",
            amountRaw: "-953578951653273",
            amount: "-0.000953578951653273",
            amountUsd: "-4.3102722193679592873",
          },
        ],
      },
    ],
    totalTokenIn: {
      networkId: 130,
      address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
      amount: "10",
      amountUsd: "10",
      amountRaw: "10000000",
    },
  },
};
