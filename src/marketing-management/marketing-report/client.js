import useSWR, { cache } from "swr"
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

export const usePlayerMarketingReport = (searchParams) => {
  //TODO: rm
  return useMarketReportList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useRegisteredPlayerList = (searchParams) => {
  //TODO: rm
  return usePlayerList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useGamePlayerList = (searchParams) => {
  //TODO: rm
  return usePlayerList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}
