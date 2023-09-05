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

export const usePlatformDepositSuccessRate = (id) => {
  let url = id ? `${API}/success-rate/${id}` : ""
  return useGet(url)
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
