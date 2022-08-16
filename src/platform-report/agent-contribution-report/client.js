import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

export const API = "/api/AgentReport"

export const useAgentContributionList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/contributions`) : ""
  return useGet(url)
}
