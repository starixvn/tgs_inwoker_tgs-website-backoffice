import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

//TODO: rm
import { useMarketReportList } from "../../platform-report/market-report/client"
import { usePlayerList } from "../../player-management/player-list/client"

const API = "/api/MarketReport"

export const useAgentMarketingReport = (searchParams) => {
  //TODO: rm
  return useMarketReportList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}
