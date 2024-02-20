import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

const API = "/api/AgentDividend"

export const useAgentDividendList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useVerifyAgentDividend = (formData) => {
  let url = formData ? `${API}/send-agent-dividend` : ""
  return usePostData(url, formData)
}
