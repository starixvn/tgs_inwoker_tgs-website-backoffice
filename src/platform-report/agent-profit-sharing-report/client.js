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
}

//TODO: rm
/*
export const useAgentDividendList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  return useGet(url)
}
*/

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
