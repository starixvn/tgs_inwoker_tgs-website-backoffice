import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import {
  useGameRoundList,
  API as RoundReportAPI
} from "../../game/round/client"
import { isPlayer } from "./Type"

export const API = "/api/AgentWinLossReport"

export const useWinlossReportPath = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/breadcrumb`) : ""
  return useGet(url)
}

export const useWinlossReport = (searchParams) => {
  if (isQueryGameRound(searchParams)) {
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

export const useExportWinlossReportUrl = (searchParams) => {
  let path = isQueryGameRound(searchParams)
    ? `${RoundReportAPI}/exportRounds`
    : `${API}/exportAgentWinLoss`
  let url = searchParams ? urlWith(searchParams, path) : ""
  return url
}

const isQueryGameRound = (searchParams) => {
  if (
    searchParams?.roundId ||
    (isPlayer(searchParams?.memberType) && searchParams?.downline === true)
  ) {
    return true
  }

  return false
}
