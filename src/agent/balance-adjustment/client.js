import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/Agent"

export const useAgentAdjustmentList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useAgentAdjustIncreaseBalance = (agentId, formData) => {
  let url = agentId && formData ? `${API}/${agentId}/adjust/increase` : ""
  return usePostData(url, formData)
}

export const useAgentAdjustReduceBalance = (agentId, formData) => {
  let url = agentId && formData ? `${API}/${agentId}/adjust/reduce` : ""
  return usePostData(url, formData)
}
