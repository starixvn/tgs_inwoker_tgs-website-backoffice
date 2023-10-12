import useSWR, { cache } from "swr"
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
  return useGet(url)
}

export const useAllAgentRebateTotalAmount = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/player-all-agent-rebate-total-amount`)
    : ""
  return useGet(url)
}
