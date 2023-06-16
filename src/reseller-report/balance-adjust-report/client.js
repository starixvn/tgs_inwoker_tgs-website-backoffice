import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

//TODO: fake
export const useBalanceAdjustReportList = (searchParams) => {
  return {
    isLoading: false,
    data: {
      items: [
        {
          licenseeCode: "TGS",
          brandCode: "GPI",
          currencyCode: "CNY",
          playerCompanyAdjustCount: 5,
          playerAgentAdjustCount: 4,
          playerBounsAdjustCount: 3,
          playerSystemAdjustCount: 2,
          playerTransferAdjustCount: 1,
          agentAdjustCount: 2,
          playerAdjustAmount: 1000,
          agentAdjustAmount: 100
        },
        {
          licenseeCode: "TGS",
          brandCode: "GPI_HKD",
          currencyCode: "CNY",
          playerCompanyAdjustCount: 1,
          playerAgentAdjustCount: 2,
          playerBounsAdjustCount: 3,
          playerSystemAdjustCount: 4,
          playerTransferAdjustCount: 5,
          agentAdjustCount: 4,
          playerAdjustAmount: 750,
          agentAdjustAmount: 0
        },
        {
          licenseeCode: "Tiger",
          brandCode: "Tiger",
          currencyCode: "HKD",
          playerCompanyAdjustCount: 3,
          playerAgentAdjustCount: 4,
          playerBounsAdjustCount: 5,
          playerSystemAdjustCount: 4,
          playerTransferAdjustCount: 3,
          agentAdjustCount: 2,
          playerAdjustAmount: 560,
          agentAdjustAmount: 340
        }
      ]
    },
    mutate: () => ({}),
    deleteCache: () => ({})
  }
}

const Player = "Player"
const Agent = "Agent"
export const UserType = {
  Player,
  Agent
}

export const usePlatformAdjustList = (brandId, userType, searchParams) => {
  return {
    isLoading: false,
    data: {
      items: [
        {
          username: "abc1234",
          amount: 456,
          type: "Bonus",
          operator: "System",
          remark: "remark"
        }
      ]
    },
    mutate: () => ({}),
    deleteCache: () => ({})
  }
}
