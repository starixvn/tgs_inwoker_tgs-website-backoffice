import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

export const API = "/api/MarketReport"

export const useMarketReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlatformMarketReportAdditionalExpenseList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/additionalExpenses`)
    : ""
  return useGet(url)
}

export const useMarketReportAgentProfitList = (searchParams) => {
  let url =
    searchParams?.brandId && searchParams?.date
      ? urlWith(searchParams, `${API}/agentProfit`)
      : ""
  return useGet(url)
}
