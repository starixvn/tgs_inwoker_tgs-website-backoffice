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

export const useAllAgentRebateDetails = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/player-all-agent-rebate-details`)
    : ""
  return useGet(url)
}

export const useAllAgentRebateGameTypeDetails = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/player-all-agent-rebate-detail-game-types`)
    : ""
  return useGet(url)
}
