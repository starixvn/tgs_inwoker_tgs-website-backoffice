import useSWR, { cache } from "swr"
import client, {
  urlWith,
  get,
  put,
  post,
  useGet,
  usePut,
  usePostData,
  usePutData,
  usePostFormData
} from "../../client"
//TODO: rm faker
import { faker } from "@faker-js/faker"

let API = "/api/overview"

export const usePlatformNewPlayerCount = (id) => {
  let url = id ? `${API}/player/reg/count/${id}` : ""
  return useGet(url)
}

export const usePlatformPlayerLoginCount = (id) => {
  let url = id ? `${API}/player/login/count/${id}` : ""
  return useGet(url)
}

export const usePlatformNetDeposit = (id) => {
  let url = id ? `${API}/net-deposit/${id}` : ""
  return useGet(url)
}

//TODO: rm fake api
export const usePlatformGrossProfit = (id) => {
  return {
    isLoading: false,
    data: 38
  }
}

const WithdrawApi = "/api/withdraw"
export const usePlatformReviewingWithdrawal = (id) => {
  let url = id
    ? `${WithdrawApi}/${id}?status=Review&status=Invalid&showAll=true`
    : ""

  let { data, ...rest } = useGet(url)
  return {
    data: data?.sum,
    ...rest
  }
}

export const usePlatformOutstandingWithdrawal = (id) => {
  let url = id ? `${WithdrawApi}/${id}?status=Approved&showAll=true` : ""

  let { data, ...rest } = useGet(url)
  return {
    data: data?.sum,
    ...rest
  }
}

const PlayerOnlineApi = "/api/playeronline"
export const usePlatformOnlinePlayerCount = (id) => {
  let url = id ? `${PlayerOnlineApi}?brandId=${id}` : ""

  let { data, ...rest } = useGet(url)
  return {
    data: data?.onlineUsers,
    ...rest
  }
}

export const usePlatformDepositSuccessRate = (id) => {
  let url = id ? `${API}/success-rate/${id}` : ""
  return useGet(url)
}

//TODO: fake api with items
export const usePlatformTopPlayerList = (id) => {
  let url = id ? `${API}/top-ten/${id}` : ""
  return useGet(url)

  /*
  let url = id
    ? urlWith(
        {
          brandId: id,
          status: "Enabled",
          page: 1,
          rows: 10
        },
        "/api/player"
      )
    : ""
  let { data, ...rest } = useGet(url)

  let items = data?.items?.map((player) => {
    return {
      ...player,
      deposit: faker.number.int(100),
      withdraw: faker.number.int(100),
      bet: faker.number.int(1000),
      payout: faker.number.int(1000),
      winLoss: faker.number.int({
        min: -100,
        max: 100
      })
    }
  })
  return {
    data: items,
    ...rest
  }
  */
}

//http://localhost:3000/api/brandgame?page=1&rows=20&sortby=displayOrder&brandId=4e86719f-243f-46f6-b010-5c758b7285af
let GameApi = "/api/brandgame"
//TODO: fake api
export const usePlatformTopGameList = (id) => {
  let url = id
    ? urlWith(
        {
          brandId: id,
          page: 1,
          rows: 10
        },
        GameApi
      )
    : ""
  let { data, ...rest } = useGet(url)

  let items = data?.items?.map((game) => {
    return {
      ...game,
      providerAbbr: faker.string.alpha(5).toUpperCase(),
      bet: faker.number.int(1000),
      winLoss: faker.number.int({
        min: -100,
        max: 100
      })
    }
  })

  return {
    data: items,
    ...rest
  }
}
