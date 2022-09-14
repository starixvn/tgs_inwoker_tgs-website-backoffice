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

  /*
  //TODO: rm
  let { data, ...rest } = useGet(url)
  data = {
    totalCount: 3,
    items: [
      {
        username: "meg701",
        id: "1aca4f86-815c-4df2-930c-d6f23e78eb2c",
        depositAmount: 1000.0,
        withdrawalAmount: 0.0,
        companyAdjustAmount: 0.0,
        bonusAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 0.0,
        betAmount: 0.0,
        validBetAmount: 0.0,
        turnover: 0.0,
        winLossAmount: 0.0,
        netProfit: 0.0,
        agentDividendAmount: 0.0,
        fromPlayerAgentDividendAmount: 0.0,
        fromTeamAgentDividendAmount: 0
      },
      {
        username: "meg801",
        id: "0acf148a-8555-4fa9-9a69-1475563c9913",
        depositAmount: 0,
        withdrawalAmount: 0,
        companyAdjustAmount: 0.0,
        bonusAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 0.0,
        betAmount: 1446.0,
        validBetAmount: 1531.0,
        turnover: 1421.0,
        winLossAmount: -1101.0,
        netProfit: -1101.0,
        agentDividendAmount: -880.8,
        fromPlayerAgentDividendAmount: -880.8,
        fromTeamAgentDividendAmount: 0
      },
      {
        username: "meg901",
        id: "71e90747-fdb5-4a67-b4df-8c75f2d1535f",
        depositAmount: 5200.0,
        withdrawalAmount: 0.0,
        companyAdjustAmount: 0.0,
        bonusAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 1814.6,
        betAmount: 93647.0,
        validBetAmount: 93765.0,
        turnover: 93765.0,
        winLossAmount: 91532.0,
        netProfit: 91532.0,
        agentDividendAmount: 82268.7,
        fromPlayerAgentDividendAmount: 82378.8,
        fromTeamAgentDividendAmount: -110.1
      }
    ],
    total: {
      depositAmount: 6200.0,
      withdrawalAmount: 0.0,
      companyAdjustAmount: 0.0,
      bonusAdjustAmount: 0.0,
      agentAdjustAmount: 0.0,
      bonusAmount: 1814.6,
      betAmount: 95093.0,
      validBetAmount: 95296.0,
      turnover: 95186.0,
      winLossAmount: 90431.0,
      netProfit: 90431.0,
      agentDividendAmount: 81387.9,
      fromPlayerAgentDividendAmount: 81498.0,
      fromTeamAgentDividendAmount: -110.1
    },
    valid: false,
    message: "",
    errors: []
  }
  return { data, ...rest }
  */
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
