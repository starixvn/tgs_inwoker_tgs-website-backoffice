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
      return downline
        ? {
            items: [{ name: "agentChild", type: "Agent" }]
          }
        : {
            items: []
          }
    case "agentChild":
      return downline
        ? {
            items: [{ name: "player", type: "Player" }]
          }
        : {
            items: [{ name: "agentParent", type: "Agent" }]
          }
    case "player":
      return downline
        ? {
            items: []
          }
        : {
            items: [
              { name: "agentParent", type: "Agent" },
              { name: "agentChild", type: "Agent" }
            ]
          }
    default:
      return {
        items: []
      }
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
