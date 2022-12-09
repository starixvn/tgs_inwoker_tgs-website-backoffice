import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
export const API = "/api/AgentReport"

const fakeAgentData = (username = "") => {
  switch (username) {
    case "Sam1010":
      return {
        username: "Sam1010",
        id: "a5320d20-f140-4a1b-bc2a-c05f7bf177a2",
        depositAmount: 0,
        withdrawalAmount: 0,
        companyAdjustAmount: 0,
        bonusAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 3673.53,
        betAmount: 73246.4,
        validBetAmount: 73140.4,
        turnover: 0,
        winLossAmount: 37974.48,
        netProfit: 34300.95,
        agentDividendAmount: 8575.22,
        fromPlayerAgentDividendAmount: 8575.22,
        fromTeamAgentDividendAmount: 0.0,
        agentDividendPercentage: 25.0,
        agentCoveredBonus: 918.37,
        agentCoveredBonusAdjust: 0.0
      }
    case "Agentlucy":
      return {
        id: "d31c78d8-ae11-4f09-b486-b8c8d8dcf20a",
        username: "Agentlucy",
        depositAmount: 0,
        withdrawalAmount: 0,
        companyAdjustAmount: 0,
        bonusAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 5641.68,
        betAmount: 227345.6,
        validBetAmount: 227345.6,
        turnover: 0,
        winLossAmount: 26947.38,
        netProfit: 21305.7,
        agentDividendAmount: 10887.08,
        fromPlayerAgentDividendAmount: 7456.99,
        fromTeamAgentDividendAmount: 3430.09,
        agentDividendPercentage: 35.0,
        agentCoveredBonus: 1974.58,
        agentCoveredBonusAdjust: 0.0
      }
    case "AgentSystem":
    default:
      return {
        username: "AgentSystem",
        id: "f07e825a-2c24-4ff2-9eb7-40375f5c67ae",
        depositAmount: 0,
        withdrawalAmount: 0,
        companyAdjustAmount: 0,
        bonusAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 0.0,
        betAmount: 0.0,
        validBetAmount: 0.0,
        turnover: 0,
        winLossAmount: 0.0,
        netProfit: 0.0,
        agentDividendAmount: 5296.63,
        fromPlayerAgentDividendAmount: 0.0,
        fromTeamAgentDividendAmount: 5296.63,
        agentDividendPercentage: 50.0,
        agentCoveredBonus: 0.0,
        agentCoveredBonusAdjust: 0.0
      }
  }
}

export const useAgentDividend = (searchParams) => {
  //TODO: rm test
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  let { data, ...rest } = useGet(url)
  if (true) {
    data = {
      agent: fakeAgentData(searchParams?.username),
      errors: [],
      message: "",
      valid: false
    }
  }

  return { data, ...rest }
}

export const useAgentDividendList = (searchParams) => {
  //TODO: rm test
  let testurl = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  let { data, ...rest } = useGet(testurl)

  if (true) {
    data = {
      totalCount: 70,
      items: [
        {
          username: "adel06",
          id: "e41c6d61-6798-4952-b467-2ceafb931dd1",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Agentkimhar",
          id: "8ce6092c-a008-424e-a9e1-a7659179877f",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Agentlucy",
          id: "d31c78d8-ae11-4f09-b486-b8c8d8dcf20a",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 3646.13,
          betAmount: 128255.2,
          validBetAmount: 128255.2,
          turnover: 0,
          winLossAmount: 18695.2,
          netProfit: 15049.07,
          agentDividendAmount: 4063.35,
          fromPlayerAgentDividendAmount: 5267.17,
          fromTeamAgentDividendAmount: -1203.82,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 1276.14,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "agharold08",
          id: "0975075e-701b-4ca4-9203-dd79fe91ce9d",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "agherance08",
          id: "bbf0cde2-1bbe-4d82-9181-932464be4614",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Aglaw",
          id: "3e74a2b0-01d3-480b-bd9a-fa3b533565af",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.01,
          betAmount: 2.0,
          validBetAmount: 2.0,
          turnover: 0,
          winLossAmount: 2.0,
          netProfit: 1.99,
          agentDividendAmount: 0.69,
          fromPlayerAgentDividendAmount: 0.69,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "AiraGanda",
          id: "4f62ebeb-c998-459a-9124-df7999d3b73b",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Ali23",
          id: "24e0b7a0-894c-4e56-b5c1-492ecf36c10f",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Almadin14",
          id: "a5493761-4494-4abb-8d54-1fd4d1bd6b53",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Arnel04",
          id: "959c638f-5ddd-4377-9961-7def635ca83f",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 728.87,
          betAmount: 68404.0,
          validBetAmount: 68404.0,
          turnover: 0,
          winLossAmount: 6068.11,
          netProfit: 5339.24,
          agentDividendAmount: 3928.54,
          fromPlayerAgentDividendAmount: 1868.73,
          fromTeamAgentDividendAmount: 2059.81,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 255.1,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "ARVIN",
          id: "ecebc5c7-9d03-4d73-b8b6-feac314076d6",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Assassin09",
          id: "8d50fde9-b519-49d2-bdf7-59fd64b14416",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 1961.72,
          betAmount: 98889.64,
          validBetAmount: 98889.64,
          turnover: 0,
          winLossAmount: 8024.21,
          netProfit: 6062.49,
          agentDividendAmount: 2885.33,
          fromPlayerAgentDividendAmount: 2728.12,
          fromTeamAgentDividendAmount: 157.21,
          agentDividendPercentage: 45.0,
          agentCoveredBonus: 882.77,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Bea",
          id: "71a11a78-86d3-45b8-b1b8-39da55959820",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "bigayanx5",
          id: "a454647e-c6de-4614-a27d-e4a93fe04563",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 151.23,
          betAmount: 14937.1,
          validBetAmount: 14937.1,
          turnover: 0,
          winLossAmount: 1532.77,
          netProfit: 1381.54,
          agentDividendAmount: 483.53,
          fromPlayerAgentDividendAmount: 483.53,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 52.93,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Cheni77",
          id: "3ee8f95a-9cef-4668-af3e-4d362692b971",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 507.94,
          betAmount: 93.0,
          validBetAmount: 93.0,
          turnover: 0,
          winLossAmount: 50.7,
          netProfit: -457.24,
          agentDividendAmount: -160.03,
          fromPlayerAgentDividendAmount: -160.03,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 177.77,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "clyde30",
          id: "960a208c-e347-424d-90ee-6235f785d99e",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Daniel07",
          id: "26b95095-b774-4b85-85d1-24269db6405d",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Dans1991",
          id: "f3bcab50-4be9-4d32-9f87-af152e6e1f8d",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        },
        {
          username: "Dante",
          id: "646e1ea9-ec57-40c3-8535-8cceb5c9083b",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 0.0,
          betAmount: 0.0,
          validBetAmount: 0.0,
          turnover: 0,
          winLossAmount: 0.0,
          netProfit: 0.0,
          agentDividendAmount: 0.0,
          fromPlayerAgentDividendAmount: 0.0,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 35.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        }
      ],
      total: {
        bonusAdjustAmount: 0.0,
        agentAdjustAmount: 0.0,
        bonusAmount: 14876.86,
        betAmount: 699251.48,
        validBetAmount: 699251.48,
        turnover: 0,
        winLossAmount: 51015.92,
        netProfit: 36139.06,
        agentDividendAmount: 19564.96,
        fromPlayerAgentDividendAmount: 13254.85,
        fromTeamAgentDividendAmount: 6310.11,
        agentCoveredBonus: 5402.99,
        agentCoveredBonusAdjust: 0.0
      },
      errors: [],
      message: "",
      valid: false
    }
  }
  return { data, ...rest }

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
