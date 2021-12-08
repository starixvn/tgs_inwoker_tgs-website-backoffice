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
import startOfDay from "date-fns/startOfDay"
import isSameDay from "date-fns/isSameDay"
import { toDate } from "../../date/toDate"
import Big from "big.js"

export const API = "/api/AgentReport"

export const useAgentDividendList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  let { data, ...rest } = useGet(url)

  /*
  //TODO: how to create data?
  data = {
    totalCount: 2,
    items: [
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        depositAmount: 40060.0,
        withdrawalAmount: 21581.0,
        adjustmentAmount: 2.03,
        bonusAmount: 387.42,
        betAmount: 34306.95,
        validBetAmount: 34307.37,
        turnover: 24683.37,
        winLossAmount: 25031.95,
        netProfit: 24642.5,
        agentDividendAmount: 13727.25,
        fromPlayerAgentDividendAmount: 10.15,
        fromTeamAgentDividendAmount: 33.69
      },
      {
        id: "2b229b15-cef4-4af0-bb99-3c7d43037ce4",
        username: "aaron1",
        depositAmount: 60000.0,
        withdrawalAmount: 0,
        adjustmentAmount: 0.0,
        bonusAmount: 0.0,
        betAmount: 21450.0,
        validBetAmount: 21450.0,
        turnover: 21450.0,
        winLossAmount: 3515.0,
        netProfit: 3515.0,
        agentDividendAmount: 351.5,
        fromPlayerAgentDividendAmount: 22.15,
        fromTeamAgentDividendAmount: 33.69
      }
    ],
    valid: true,
    message: "",
    errors: []
  }
  */

  return {
    data,
    ...rest
  }
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

  let { data, ...rest } = useGet(url)

  /* 
  //TODO: how to create data
  data = {
    totalCount: 10,
    items: [
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-03T16:30:16.531504+00:00",
        settlementDateFrom: "2021-11-02T16:00:00+00:00",
        settlementDateTo: "2021-11-02T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: 0.0,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 0.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: 0.0,
        agentDividendAmount: 1406.0,
        agentDividendPercentage: 50.0,
        expenditureAmount: 0.0,
        bonusAmount: 10.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-16T16:30:02.97177+00:00",
        settlementDateFrom: "2021-11-15T16:00:00+00:00",
        settlementDateTo: "2021-11-15T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: -580.0,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 11200.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: 10620.0,
        agentDividendAmount: 5310.0,
        agentDividendPercentage: 50.0,
        expenditureAmount: 0.0,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-11T16:30:08.780906+00:00",
        settlementDateFrom: "2021-11-10T16:00:00+00:00",
        settlementDateTo: "2021-11-10T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: 0.0,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 0.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: 0.0,
        agentDividendAmount: -3.88,
        agentDividendPercentage: 50.0,
        expenditureAmount: 7.76,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-04T16:30:15.233729+00:00",
        settlementDateFrom: "2021-11-03T16:00:00+00:00",
        settlementDateTo: "2021-11-03T16:00:00+00:00",
        liveDealerWinLoss: -33.0,
        slotWinLoss: 0.0,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 0.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: -33.0,
        agentDividendAmount: -16.5,
        agentDividendPercentage: 50.0,
        expenditureAmount: 0.0,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-09T16:30:02.424405+00:00",
        settlementDateFrom: "2021-11-08T16:00:00+00:00",
        settlementDateTo: "2021-11-08T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: 0.0,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 0.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: 0.0,
        agentDividendAmount: -1.015,
        agentDividendPercentage: 50.0,
        expenditureAmount: 2.03,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-10T16:30:07.437499+00:00",
        settlementDateFrom: "2021-11-09T16:00:00+00:00",
        settlementDateTo: "2021-11-09T16:00:00+00:00",
        liveDealerWinLoss: 174.6,
        slotWinLoss: -60.7,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: -690.42,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: -576.52,
        agentDividendAmount: -296.76,
        agentDividendPercentage: 50.0,
        expenditureAmount: 17.0,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-13T16:30:08.109231+00:00",
        settlementDateFrom: "2021-11-12T16:00:00+00:00",
        settlementDateTo: "2021-11-12T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: 0.0,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 0.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: 0.0,
        agentDividendAmount: -0.005,
        agentDividendPercentage: 50.0,
        expenditureAmount: 0.01,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-17T16:30:08.663015+00:00",
        settlementDateFrom: "2021-11-16T16:00:00+00:00",
        settlementDateTo: "2021-11-16T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: 17.92,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 0.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: 17.92,
        agentDividendAmount: -0.54,
        agentDividendPercentage: 50.0,
        expenditureAmount: 19.0,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-18T16:30:04.781775+00:00",
        settlementDateFrom: "2021-11-17T16:00:00+00:00",
        settlementDateTo: "2021-11-17T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: 5325.0,
        lotteryWinLoss: 0.0,
        cardGameWinLoss: 9679.75,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: 15004.75,
        agentDividendAmount: 7330.55,
        agentDividendPercentage: 50.0,
        expenditureAmount: 343.65,
        bonusAmount: 0.0
      },
      {
        id: "fe807372-d708-452c-878b-423e2292ea2f",
        username: "aaronxiao",
        settlementDate: "2021-11-12T16:30:12.9647+00:00",
        settlementDateFrom: "2021-11-11T16:00:00+00:00",
        settlementDateTo: "2021-11-11T16:00:00+00:00",
        liveDealerWinLoss: 0.0,
        slotWinLoss: 0.0,
        lotteryWinLoss: -1.2,
        cardGameWinLoss: 0.0,
        sportsWinLoss: 0.0,
        virtualSportsWinLoss: 0.0,
        winLossAmount: -1.2,
        agentDividendAmount: -0.6,
        agentDividendPercentage: 50.0,
        expenditureAmount: 0.0,
        bonusAmount: 0.0
      }
    ],
    valid: true,
    message: "",
    errors: []
  }
  */

  let items = data?.items
    ? groupWith((a, b) => {
        let result =
          isSameDay(a.settlementDate, b.settlementDate) &&
          isSameDay(a.settlementDateFrom, b.settlementDateFrom) &&
          isSameDay(a.settlementDateTo, b.settlementDateTo)
        return result
      }, data.items)
    : undefined

  items = items?.reduce?.((acc, groupedItems = [], index) => {
    let [item] = groupedItems

    let group = {
      isHead: true,
      settlementDate: clone(item.settlementDate),
      settlementDateFrom: clone(item.settlementDateFrom),
      settlementDateTo: clone(item.settlementDateTo)
    }

    let totals = mapObjIndexed((value, field) => {
      if (Number.isFinite(value)) {
        let values = pluck(field, groupedItems)
        let total = values.reduce((number, value) => {
          return number.plus(new Big(value))
        }, new Big(0))

        return total.toNumber()
      }
    }, item)

    let foot = {
      isFoot: true,
      ...totals
    }

    return [...acc, group, ...groupedItems, foot]
  }, [])

  return {
    data: items
      ? {
          ...data,
          items
        }
      : undefined,
    ...rest
  }
}
