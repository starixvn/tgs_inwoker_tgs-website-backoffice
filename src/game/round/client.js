import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

const API = "/api/RoundReport"

export const useGameRoundList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
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

export const useGameRoundBalanceChangeList = (id) => {
  let url = id ? `` : ""

  //TODO: rm test url
  url =
    "/api/player/accountChanges?from=2022-01-11T05:26:32.936Z&to=2022-01-11T15:59:59.999Z&brandId=4e86719f-243f-46f6-b010-5c758b7285af&playerCode=4ufsal8i4cnt&sortby=recordedOn&orderby=descending&page=1&rows=20"
  return useGet(url)
}
