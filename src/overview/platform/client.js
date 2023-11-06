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
import { today } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"

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
  let todayRange = today()

  let beginCreateOn = todayRange.start
  let endCreateOn = startOfNextDay(todayRange.end)

  let url = id
    ? `${WithdrawApi}/${id}?status=Review&status=Invalid&bc=${beginCreateOn.toISOString()}&ec=${endCreateOn.toISOString()}&showAll=true`
    : ""

  let { data, ...rest } = useGet(url)

  return {
    data: data?.totalCount,
    ...rest
  }
}

export const usePlatformOutstandingWithdrawal = (id) => {
  let todayRange = today()

  let beginCreateOn = todayRange.start
  let endCreateOn = startOfNextDay(todayRange.end)

  let url = id
    ? `${WithdrawApi}/${id}?status=Approved&bc=${beginCreateOn.toISOString()}&ec=${endCreateOn.toISOString()}&&showAll=true`
    : ""

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

export const usePlatformTopPlayerList = (id, searchParams) => {
  let url =
    id && searchParams ? urlWith(searchParams, `${API}/top-ten/${id}`) : ""
  return useGet(url)
}

export const usePlatformTopGameList = (id, searchParams) => {
  let url =
    id && searchParams ? urlWith(searchParams, `${API}/top-ten/game/${id}`) : ""
  return useGet(url)

  /*
  let url = id
    ? urlWith(
        {
          brandId: id,
          page: 1,
          rows: 10,
          culture: "zh-CN"
        },
        "/api/brandgame"
      )
    : ""
  let { data, ...rest } = useGet(url)

  let items = data?.items?.map((game) => {
    return {
      ...game,
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
  */
}
