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
  roundId,
  ...searchParams
} = {}) => {
  // agentParent > agentChild > player
  // agent123 -> agent456 > player123
  if (roundId) {
    return {
      data: {
        items: [
          { username: "agentParent", type: "Agent" },
          { username: "agentChild", type: "Agent" },
          { username: "player", type: "Player" }
        ]
      }
    }
  }
  switch (username) {
    case "agentParent":
      return {
        data: {
          items: []
        }
      }
    case "agentChild":
      return {
        data: {
          items: [{ username: "agentParent", type: "Agent" }]
        }
      }
    case "player":
      return {
        data: {
          items: [
            { username: "agentParent", type: "Agent" },
            { username: "agentChild", type: "Agent" }
          ]
        }
      }
    case "agent123":
      return {
        data: {
          items: []
        }
      }
    case "agent456":
      return {
        data: {
          items: [{ username: "agent123", type: "Agent" }]
        }
      }
    case "player123":
      return {
        data: {
          items: [
            { username: "agent123", type: "Agent" },
            { username: "agent456", type: "Agent" }
          ]
        }
      }
    default:
      return {
        data: {
          items: []
        }
      }
  }
}

//no roundId?
export const useWinlossReport = ({
  username,
  downline,
  roundId,
  ...searchParams
} = {}) => {
  switch (username) {
    case "agentParent":
      return downline
        ? {
            data: {
              items: [
                {
                  username: "agentChild",
                  type: "Agent"
                }
              ]
            }
          }
        : {
            data: {
              items: [
                {
                  username: "agentParent",
                  type: "Agent"
                }
              ]
            }
          }
    case "agentChild":
      return downline
        ? {
            data: {
              items: [
                {
                  username: "player",
                  type: "Player"
                }
              ]
            }
          }
        : {
            data: {
              items: [
                {
                  username: "agentChild",
                  type: "Agent"
                }
              ]
            }
          }
    //TODO: user order report api?
    case "player":
      return downline
        ? {
            data: {
              items: [
                {
                  username: "xxx-order",
                  type: "Order"
                }
              ]
            }
          }
        : {
            data: {
              items: [
                {
                  username: "player",
                  type: "Player"
                }
              ]
            }
          }
    case "agent123":
      return downline
        ? {
            data: {
              items: [
                {
                  username: "agent456",
                  type: "Agent"
                }
              ]
            }
          }
        : {
            data: {
              items: [
                {
                  username: "agent123",
                  type: "Agent"
                }
              ]
            }
          }
    case "agent456":
      return downline
        ? {
            data: {
              items: [
                {
                  username: "player789",
                  type: "Player"
                }
              ]
            }
          }
        : {
            data: {
              items: [
                {
                  username: "agent456",
                  type: "Agent"
                }
              ]
            }
          }
    case "player789":
      return downline
        ? {
            data: {
              items: [
                {
                  username: "xxx-order",
                  type: "Order"
                }
              ]
            }
          }
        : {
            data: {
              items: [
                {
                  username: "player789",
                  type: "Player"
                }
              ]
            }
          }
    default:
      let items = [
        {
          username: "agentParent",
          type: "Agent"
        },
        {
          username: "agent123",
          type: "Agent"
        }
      ]

      return {
        data: {
          items
        }
      }
  }
}
