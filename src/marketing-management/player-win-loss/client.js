import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

//TODO: rm
import { usePlayerList } from "../../player-management/player-list/client"
import { useGameProviderReportList } from "../../platform-report/game-provider-report/client"

const API = "/api/MarketReport"

export const usePlayerTotalAmountList = (searchParams) => {
  //TODO: rm
  return usePlayerList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlayerTotalWinLossList = (searchParams) => {
  //TODO: rm
  return useGameProviderReportList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}
