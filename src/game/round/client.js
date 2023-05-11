import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

export const API = "/api/RoundReport"

export const useGameRoundList = (searchParams, options) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url, options)
}

export const useGameBetRecordList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/betRecords`) : ""
  return useGet(url)
}

export const useGameRound = (id, searchParams) => {
  let url =
    id &&
    searchParams?.gameProviderCode &&
    searchParams?.playerCode &&
    searchParams?.language
      ? urlWith(searchParams, `${API}/${id}`)
      : ""

  return useGet(url)
}

const GameAction = `/api/GameActionReport`
export const useGameRoundBalanceChangeList = (searchParams) => {
  let url = searchParams?.roundId ? urlWith(searchParams, GameAction) : ""
  return useGet(url)
}

export const useSystemGameRoundList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/system`) : ""
  return useGet(url)
}

export const useSystemGameRoundListTotal = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/system/total`) : ""
  return useGet(url)
}

export const systemGameRoundListDownloadUrl = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/exportSystemRounds`)
    : ""
  return url
}

export const useAddSystemGameRound = (data) => {
  let url = data ? `${API}/system/addround` : ""
  return usePutData(url, data)
}
