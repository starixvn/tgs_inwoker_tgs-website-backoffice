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
export const useAgentDividend = (searchParams) => {
  //TODO: rm test
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  let { data, ...rest } = useGet(url)
  if (true) {
    data = {
      subTotalCount: 2,
      mainItems: [
        {
          username: "meg901",
          id: "71e90747-fdb5-4a67-b4df-8c75f2d1535f",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 0.0,
          agentAdjustAmount: 0.0,
          bonusAmount: 3162.5,
          betAmount: 11250.0,
          validBetAmount: 11250.0,
          turnover: 0,
          winLossAmount: -7740.0,
          netProfit: -10902.5,
          agentDividendAmount: -8798.21,
          fromPlayerAgentDividendAmount: -9812.25,
          fromTeamAgentDividendAmount: 1014.04,
          agentDividendPercentage: 90.0,
          agentCoveredBonus: 2846.25,
          agentCoveredBonusAdjust: 0.0
        }
      ],
      subItems: [
        {
          username: "meg701",
          id: "1aca4f86-815c-4df2-930c-d6f23e78eb2c",
          depositAmount: 0,
          withdrawalAmount: 0,
          companyAdjustAmount: 0,
          bonusAdjustAmount: 1000.0,
          agentAdjustAmount: 500.0,
          bonusAmount: 744.9,
          betAmount: 6690.0,
          validBetAmount: 6690.0,
          turnover: 0,
          winLossAmount: 4280.0,
          netProfit: 2535.1,
          agentDividendAmount: 767.55,
          fromPlayerAgentDividendAmount: 1267.55,
          fromTeamAgentDividendAmount: 0.0,
          agentDividendPercentage: 50.0,
          agentCoveredBonus: 372.45,
          agentCoveredBonusAdjust: 500.0
        },
        {
          username: "meg801",
          id: "0acf148a-8555-4fa9-9a69-1475563c9913",
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
          agentDividendPercentage: 80.0,
          agentCoveredBonus: 0.0,
          agentCoveredBonusAdjust: 0.0
        }
      ],
      subTotal: {
        bonusAdjustAmount: 1000.0,
        agentAdjustAmount: 500.0,
        bonusAmount: 744.9,
        betAmount: 6690.0,
        validBetAmount: 6690.0,
        turnover: 0,
        winLossAmount: 4280.0,
        netProfit: 2535.1,
        agentDividendAmount: 767.55,
        fromPlayerAgentDividendAmount: 1267.55,
        fromTeamAgentDividendAmount: 0.0,
        agentCoveredBonus: 372.45,
        agentCoveredBonusAdjust: 500.0
      },
      errors: [],
      message: "",
      valid: true
    }
  }

  return { data, ...rest }
}
