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

export let PlayerApi = "/api/player"

//TODO: fake api with items
export const usePlatformTopPlayerList = (id) => {
  let url = id
    ? urlWith(
        {
          brandId: id,
          status: "Enabled",
          page: 1,
          rows: 10
        },
        PlayerApi
      )
    : ""
  let { data, ...rest } = useGet(url)
  return {
    data: data?.items,
    ...rest
  }
}
