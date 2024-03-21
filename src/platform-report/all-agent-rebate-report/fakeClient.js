import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

export const API = "/api/PlayerReport"

export const useAllAgentRebateList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/player-all-agent-rebates`)
    : ""
  let { data, ...rest } = useGet(url)
  data = [
    {
      username: "qatest0923",
      playerCode: "4uhyekcw88dy",
      maxActivePlayerNumber: 2,
      validBet: 14.0,
      rebate: 0.35,
      settleDateTime: "2023-02-13T16:00:00+00:00",
      sentOn: "2023-02-14T16:35:08.982617+00:00"
    },
    {
      username: "qatest0923",
      playerCode: "4uhyekcw88dy",
      maxActivePlayerNumber: 2,
      validBet: 0.0,
      rebate: 0.0,
      settleDateTime: "2023-02-12T16:00:00+00:00",
      sentOn: "2023-02-13T16:35:01.920243+00:00"
    },
    {
      username: "qatest0923",
      playerCode: "4uhyekcw88dy",
      maxActivePlayerNumber: 2,
      validBet: 0.0,
      rebate: 0.0,
      settleDateTime: "2023-02-09T16:00:00+00:00",
      sentOn: "2023-02-10T16:35:07.324504+00:00"
    },
    {
      username: "qatest0923",
      playerCode: "4uhyekcw88dy",
      maxActivePlayerNumber: 2,
      validBet: 14.0,
      rebate: 0.35,
      settleDateTime: "2023-02-13T16:00:00+00:00",
      sentOn: "2023-02-14T16:35:08.982617+00:00"
    },
    {
      username: "qatest0923",
      playerCode: "4uhyekcw88dy",
      maxActivePlayerNumber: 2,
      validBet: 0.0,
      rebate: 0.0,
      settleDateTime: "2023-02-12T16:00:00+00:00",
      sentOn: "2023-02-13T16:35:01.920243+00:00"
    },
    {
      username: "qatest0923",
      playerCode: "4uhyekcw88dy",
      maxActivePlayerNumber: 2,
      validBet: 0.0,
      rebate: 0.0,
      settleDateTime: "2023-02-09T16:00:00+00:00",
      sentOn: "2023-02-10T16:35:07.324504+00:00"
    }
  ]

  return {
    data,
    ...rest
  }
}

export const useAllAgentRebateTotalAmount = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/player-all-agent-rebate-total-amount`)
    : ""
  let { data, ...rest } = useGet(url)
  data = { totalCount: 3, validBet: 14.0, rebate: 0.35 }
  return {
    data,
    ...rest
  }
}

export const useAllAgentRebateDetails = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/player-all-agent-rebate-details`)
    : ""
  let { data, ...rest } = useGet(url)
  data = [
    {
      username: "qatest2022113011",
      playerCode: "4uhyekcw88dy",
      rebateSubTotal: 0.325,
      sportsbookValidBet: 0.0,
      sportsbookRebate: 0.0,
      virtualSportsValidBet: 0.0,
      virtualSportsRebate: 0.0,
      liveDealerValidBet: 0.0,
      liveDealerRebate: 0.0,
      cardGameValidBet: 13.0,
      cardGameRebate: 0.325,
      lotteryValidBet: 0.0,
      lotteryRebate: 0.0,
      slotValidBet: 0.0,
      slotRebate: 0.0
    },
    {
      username: "qatest2022113012",
      playerCode: "4uhyekcw88dy",
      rebateSubTotal: 0.025,
      sportsbookValidBet: 0.0,
      sportsbookRebate: 0.0,
      virtualSportsValidBet: 0.0,
      virtualSportsRebate: 0.0,
      liveDealerValidBet: 0.0,
      liveDealerRebate: 0.0,
      cardGameValidBet: 1.0,
      cardGameRebate: 0.025,
      lotteryValidBet: 0.0,
      lotteryRebate: 0.0,
      slotValidBet: 0.0,
      slotRebate: 0.0
    },
    {
      username: "qatest2022113011",
      playerCode: "4uhyekcw88dy",
      rebateSubTotal: 0.325,
      sportsbookValidBet: 0.0,
      sportsbookRebate: 0.0,
      virtualSportsValidBet: 0.0,
      virtualSportsRebate: 0.0,
      liveDealerValidBet: 0.0,
      liveDealerRebate: 0.0,
      cardGameValidBet: 13.0,
      cardGameRebate: 0.325,
      lotteryValidBet: 0.0,
      lotteryRebate: 0.0,
      slotValidBet: 0.0,
      slotRebate: 0.0
    },
    {
      username: "qatest2022113012",
      playerCode: "4uhyekcw88dy",
      rebateSubTotal: 0.025,
      sportsbookValidBet: 0.0,
      sportsbookRebate: 0.0,
      virtualSportsValidBet: 0.0,
      virtualSportsRebate: 0.0,
      liveDealerValidBet: 0.0,
      liveDealerRebate: 0.0,
      cardGameValidBet: 1.0,
      cardGameRebate: 0.025,
      lotteryValidBet: 0.0,
      lotteryRebate: 0.0,
      slotValidBet: 0.0,
      slotRebate: 0.0
    },
    {
      username: "qatest2022113011",
      playerCode: "4uhyekcw88dy",
      rebateSubTotal: 0.325,
      sportsbookValidBet: 0.0,
      sportsbookRebate: 0.0,
      virtualSportsValidBet: 0.0,
      virtualSportsRebate: 0.0,
      liveDealerValidBet: 0.0,
      liveDealerRebate: 0.0,
      cardGameValidBet: 13.0,
      cardGameRebate: 0.325,
      lotteryValidBet: 0.0,
      lotteryRebate: 0.0,
      slotValidBet: 0.0,
      slotRebate: 0.0
    },
    {
      username: "qatest2022113012",
      playerCode: "4uhyekcw88dy",
      rebateSubTotal: 0.025,
      sportsbookValidBet: 0.0,
      sportsbookRebate: 0.0,
      virtualSportsValidBet: 0.0,
      virtualSportsRebate: 0.0,
      liveDealerValidBet: 0.0,
      liveDealerRebate: 0.0,
      cardGameValidBet: 1.0,
      cardGameRebate: 0.025,
      lotteryValidBet: 0.0,
      lotteryRebate: 0.0,
      slotValidBet: 0.0,
      slotRebate: 0.0
    }
  ]
  return {
    data,
    ...rest
  }
}

export const useAllAgentRebateGameTypeDetails = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/player-all-agent-rebate-detail-game-types`)
    : ""
  let { data, ...rest } = useGet(url)
  data = [
    {
      allAgentGameType: "CardGame",
      activePlayerNumber: 2,
      rebatePercentage: 2.5
    }
  ]
  return {
    data,
    ...rest
  }
}
