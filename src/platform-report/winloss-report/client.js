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

//TODO: rm fake
const FakePlayerUsername = "Herman1682314945488"
export const useWinlossReportPath = (
  searchParams
  /*{
  username,
  roundId,
  ...searchParams
} = {}
*/
) => {
  let url = searchParams ? urlWith(searchParams, `${API}/breadcrumb`) : ""
  return useGet(url)

  // agentParent > agentChild > player
  // agent123 -> agent456 > player123
  if (roundId) {
    return {
      data: {
        items: [
          { username: "agentParent", type: "Agent" },
          { username: "agentChild", type: "Agent" },
          { username: FakePlayerUsername, type: "Player" }
        ]
      },
      mutate: () => ({}),
      deleteCache: () => ({})
    }
  }
  switch (username) {
    case "agentParent":
      return {
        data: {
          items: []
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
    case "agentChild":
      return {
        data: {
          items: [{ username: "agentParent", type: "Agent" }]
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
    case FakePlayerUsername:
      return {
        data: {
          items: [
            { username: "agentParent", type: "Agent" },
            { username: "agentChild", type: "Agent" }
          ]
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
    case "agent123":
      return {
        data: {
          items: []
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
    case "agent456":
      return {
        data: {
          items: [{ username: "agent123", type: "Agent" }]
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
    case FakePlayerUsername:
      return {
        data: {
          items: [
            { username: "agent123", type: "Agent" },
            { username: "agent456", type: "Agent" }
          ]
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
    default:
      return {
        data: {
          items: []
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
  }
}

//no roundId?
const FakeOrders = [
  {
    type: "Order",
    additionalData: "",
    betAmount: 1.0,
    closedOn: "2023-04-24T05:42:31.563046+00:00",
    createdOn: "2023-04-24T05:42:31.563046+00:00",
    currencyCode: "CNY",
    externalClosedOn: "2023-04-24T05:42:25.774+00:00",
    externalCreatedOn: "2023-04-24T05:42:25.774+00:00",
    externalPlayerCode: "4ujrm784ukwo",
    externalRoundId: "sRKuAVtWEsxEelpU7AO94",
    gameId: 4000001,
    gameName: "Baccarat Classic",
    gameProviderCode: "AWC_SG",
    gameProviderId: "8b0fe910-b8c6-440a-ae84-2f797b9a312f",
    gameProviderName: "AWC_SG",
    id: "b1c8fb84-8701-0000-0001-00002af4f405",
    platformType: "Desktop",
    playerCode: "4ujrm784ukwo",
    playerName: "Herman1682314945488",
    settleAmount: 1,
    status: "Win",
    subGameProviderName: "AWC_SG",
    turnover: 1.0,
    updatedOn: "0001-01-01T00:00:00+00:00",
    validBetAmount: 1,
    winLoss: -1.0
  }
]
export const useWinlossReport = (searchParams) => {
  //TODO: rm, use useGameRoundList @ index.js
  if (
    isPlayerMemberType(searchParams?.memberType) &&
    searchParams?.downline === true
  ) {
    return useGameRoundList(searchParams)
  }

  let url = searchParams ? urlWith(searchParams, `${API}/agentWinLoss`) : ""
  return useGet(url)

  switch (searchParams?.username) {
    case "agentParent":
      return searchParams?.downline
        ? {
            data: {
              items: [
                {
                  username: "agentChild",
                  type: "Agent",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
        : {
            data: {
              items: [
                {
                  username: "agentParent",
                  type: "Agent",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
    case "agentChild":
      return searchParams?.downline
        ? {
            data: {
              items: [
                {
                  username: FakePlayerUsername,
                  type: "Player",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
        : {
            data: {
              items: [
                {
                  username: "agentChild",
                  type: "Agent",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
    //TODO: user order report api?
    case FakePlayerUsername:
      return searchParams?.downline
        ? {
            data: {
              items: FakeOrders
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
        : {
            data: {
              items: [
                {
                  username: FakePlayerUsername,
                  type: "Player",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
    case "agent123":
      return searchParams?.downline
        ? {
            data: {
              items: [
                {
                  username: "agent456",
                  type: "Agent",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
        : {
            data: {
              items: [
                {
                  username: "agent123",
                  type: "Agent",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
    case "agent456":
      return searchParams?.downline
        ? {
            data: {
              items: [
                {
                  username: FakePlayerUsername,
                  type: "Player",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
        : {
            data: {
              items: [
                {
                  username: "agent456",
                  type: "Agent",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
    case FakePlayerUsername:
      return searchParams?.downline
        ? {
            data: {
              items: FakeOrders
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
        : {
            data: {
              items: [
                {
                  username: FakePlayerUsername,
                  type: "Player",
                  tickets: 35,
                  turnover: 7800,
                  playerWinloss: -1600,
                  playerSpecial: 240,
                  agentWinloss: 980,
                  agentSpecial: -156,
                  agentTotal: 824,
                  companyWinloss: 620,
                  companySpecial: -54,
                  companyTotal: 536
                }
              ]
            },
            mutate: () => ({}),
            deleteCache: () => ({})
          }
    default:
      let items = [
        {
          username: "agentParent",
          type: "Agent",
          tickets: 35,
          turnover: 7800,
          playerWinloss: -1600,
          playerSpecial: 240,
          agentWinloss: 980,
          agentSpecial: -156,
          agentTotal: 824,
          companyWinloss: 620,
          companySpecial: -54,
          companyTotal: 536
        },
        {
          username: "agent123",
          type: "Agent",
          tickets: 35,
          turnover: 7800,
          playerWinloss: -1600,
          playerSpecial: 240,
          agentWinloss: 980,
          agentSpecial: -156,
          agentTotal: 824,
          companyWinloss: 620,
          companySpecial: -54,
          companyTotal: 536
        }
      ]

      return {
        data: {
          items
        },
        mutate: () => ({}),
        deleteCache: () => ({})
      }
  }
}
