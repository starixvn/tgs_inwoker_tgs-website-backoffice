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

export const useAgentDividend = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  let { data, ...rest } = useGet(url)
  if (data) {
    let agent = data?.items?.find(
      (item) => item.username === searchParams?.username
    )
    data = {
      items: [agent],
      errors: [],
      message: "",
      valid: false
    }
  }

  return { data, ...rest }
}

export const useAgentDividendList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  return useGet(url)
}

export const useAgentDividendDetailList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividendDetails`) : ""
  return useGet(url)
}

export const useAgentWinLossList = (id, searchParams) => {
  let url =
    id && searchParams ? urlWith(searchParams, `${API}/${id}/winLoss`) : ""
  return useGet(url)
}

export const useAgentTeamContributionList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/dividendTeamDetails`)
    : ""

  return useGet(url)
}
