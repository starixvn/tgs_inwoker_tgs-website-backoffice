import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

const API = "/api/MarketingReport"

export const useMarketingReport = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useMarketingRegisteredPlayerList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/registerDetail`) : ""
  return useGet(url)
}

export const useMarketingFirstDepositPlayerList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/firstDepositDetail`)
    : ""
  return useGet(url)
}

export const useMarketingGamePlayerList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/gamingDetail`) : ""
  return useGet(url)
}
