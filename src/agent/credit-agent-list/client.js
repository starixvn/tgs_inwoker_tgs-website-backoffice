import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete
} from "../../client"
import { useAgentList } from "../agent-list/client"

let API = "/api/creditagent"

export const useCreditAgentList = (searchParams) => {
  return useAgentList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useCreditAgent = (id) => {
  let url = id ? `${API}/${id}` : ""
  let { data, ...rest } = useGet(url)

  return {
    data: data?.agent,
    ...rest
  }
}

export const useAddCreditAgent = (formData) => {
  let url = formData ? API : ""
  return usePostData(url, formData)
}

export const useUpdateCreditAgent = (agentId, formData) => {
  let url = agentId ? `${API}/${agentId}` : ""
  return usePutData(url, formData)
}

export const useCreditAgentOperations = (agentId, searchParams) => {
  let url = agentId ? urlWith(searchParams, `${API}/${agentId}/operations`) : ""
  return useGet(url)
}

export const useCreditAgentBalanceChanges = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/accountChanges`) : ""
  return useGet(url)
}
