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

//TODO: rm fakeClient.js
const fakeAgentData = (username = "") => {
  switch (username) {
    case "Sam1010":
      return {
        username: "reportDate",
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
      items: [
        fakeAgentData(searchParams?.username),
        fakeAgentData(searchParams?.username)
      ],
      errors: [],
      message: "",
      valid: false
    }
  }

  return { data, ...rest }
}
