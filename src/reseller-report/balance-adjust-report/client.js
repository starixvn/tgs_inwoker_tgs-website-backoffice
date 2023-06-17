import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { UserType } from "./UserType"

const API = "/api/adjust-wallet"

export const useBalanceAdjustReportList = (searchParams) => {
  let url =
    searchParams?.resellerId && searchParams
      ? urlWith(searchParams, `${API}/summary/${searchParams?.resellerId}`)
      : ""

  return useGet(url)

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

const toAdjustListPath = (value) => {
  switch (value) {
    case UserType.Player:
      return "player"
    case UserType.Agent:
      return "agent"
    default:
      return ""
  }
}

//TODO: integrate api
export const usePlatformAdjustList = (brandId, userType, searchParams) => {
  let path = toAdjustListPath(userType)
  let url =
    brandId && path ? urlWith(searchParams, `${API}/${path}/${brandId}`) : ""

  return useGet(url)

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
