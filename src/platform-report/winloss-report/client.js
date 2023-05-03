import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { useGameRoundList } from "../../game/round/client"
import { Player, isPlayerMemberType } from "./MemberType"

export const API = "/api/AgentWinLossReport"

export const useWinlossReportPath = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/breadcrumb`) : ""
  return useGet(url)
}

export const useWinlossReport = (searchParams) => {
  if (searchParams?.roundId /*&& searchParams?.downline === true*/) {
    return useGameRoundList(searchParams)
  }

  let url = searchParams ? urlWith(searchParams, `${API}/agentWinLoss`) : ""
  return useGet(url)
}

export const useWinlossReportPlayerSpecial = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/agentPlayerSpecialDetail`)
    : ""
  return useGet(url)
}

export const useWinlossReportAgentTotal = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/agentTotalDetail`) : ""
  return useGet(url)
}

export const useWinlossReportCompanyTotal = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/companyTotalDetail`)
    : ""
  return useGet(url)
}
