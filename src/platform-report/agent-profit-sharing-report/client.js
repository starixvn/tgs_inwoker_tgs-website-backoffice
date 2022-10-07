import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import {
  groupWith,
  eqProps,
  compose,
  flatten,
  equals,
  eqBy,
  mapObjIndexed,
  pluck
} from "ramda"
import clone from "clone-deep"
import { isSameDay } from "date-fns"
import { toDate } from "../../date/toDate"
import Big from "big.js"

//TODO: Remove
import { nanoid } from "nanoid"
import faker from "@faker-js/faker"

export const API = "/api/AgentReport"

export const useAgentProfitSharingRootList = (searchParams) => {
  let url = searchParams
    ? urlWith(
        searchParams,
        `/api/MarketReport`
      ) /*urlWith(searchParams, `${API}/dividends`)*/
    : ""
  let { data, ...rest } = useGet(url)

  if (data) {
    let totalCount = 1000
    let items = []
    for (var i = 0; i < totalCount; i++) {
      items[i] = {
        hasChildren: true,
        id: `${nanoid()}-${i}`,
        username: `${faker.name.firstName()}-${i}`,
        depositAmount: Math.random() * 100,
        withdrawalAmount: Math.random() * 100,
        companyAdjustAmount: Math.random() * 100,
        agentAdjustAmount: Math.random() * 100,
        bonusAmount: Math.random() * 100,
        betAmount: Math.random() * 100,
        validBetAmount: Math.random() * 100,
        turnover: Math.random() * 100,
        winLossAmount: Math.random() * 100,
        netProfit: Math.random() * 100,
        agentDividendAmount: Math.random() * 100,
        fromPlayerAgentDividendAmount: Math.random() * 100,
        fromTeamAgentDividendAmount: Math.random() * 100
      }
    }

    data = {
      totalCount,
      items,
      total: {
        depositAmount: 3658.0,
        withdrawalAmount: 42938.0,
        companyAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 1159.6,
        betAmount: 63276.0,
        validBetAmount: 63036.0,
        turnover: 11606.0,
        winLossAmount: -36422.59,
        netProfit: -37582.19,
        agentDividendAmount: -18791.095,
        fromPlayerAgentDividendAmount: -18791.095,
        fromTeamAgentDividendAmount: 0.0
      }
    }
  }

  return {
    data,
    ...rest
  }
}

export const useAgentProfitSharingChildrenList = (searchParams) =>
  useAgentProfitSharingRootList(searchParams)

export const useAgentDividendList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  return useGet(url)
}

export const useAgentDividendDetailList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividendDetails`) : ""
  return useGet(url)
}

export const useAgentWinLossList = (id, searchParams) => {
  let url =
    id && searchParams ? urlWith(searchParams, `${API}/${id}/winLoss`) : ""
  return useGet(url)
}

export const useAgentTeamContributionList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/dividendTeamDetails`)
    : ""

  return useGet(url)
}
