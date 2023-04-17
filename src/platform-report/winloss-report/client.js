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

//TODO:
// username, type, downline?,
export const useWinlossReportTreePath = ({
  username,
  downline,
  orderId,
  ...searchParams
} = {}) => {
  // agentParent > agentChild > player
  if (orderId) {
    return {}
  }
  switch (username) {
    case "agentParent":
      return downline ? {} : {}
    case "agentChild":
      return downline ? {} : {}
    case "player":
      return downline ? {} : {}
    default:
      return {}
  }
}

//no orderId?
export const useWinlossReport = ({
  username,
  downline,
  orderId,
  ...searchParams
} = {}) => {
  switch (username) {
    case "agentParent":
      return downline ? {} : {}
    case "agentChild":
      return downline ? {} : {}
    case "player":
      return downline ? {} : {}
    default:
      return {}
  }
}
