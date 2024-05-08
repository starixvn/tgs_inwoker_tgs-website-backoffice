import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

export const API = "/api/AgentReport"

export const useAgentDividend = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/AgentDividends`) : ""
  return useGet(url)
}

export const useAgentDividendProductFee = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/dividend/product-fee`)
    : ""

  return useGet(url)

  //TODO: rm fake data
  /*
  let { data, isLoading, error, ...rest } = useGet(url)
  if (!isLoading) {
    data = {
      liveDealerAmount: 1,
      slotAmount: 2,
      lotteryAmount: 3,
      cardGameAmount: 4,
      sportsAmount: 5,
      virtualSportsAmount: 6
    }
  }
  return { data, isLoading, ...rest }
  */
}

//TODO: rm?
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
