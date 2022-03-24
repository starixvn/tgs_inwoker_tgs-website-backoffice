import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/player"

export const usePlayerList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlayer = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}` : ""
  let { data, ...rest } = useGet(url)
  return {
    data: data?.player,
    ...rest
  }
}

export const useEditPlayerInfo = (playerCode, data) => {
  let url = playerCode ? `${API}/${playerCode}/info` : ""
  return usePutData(url, data)
}

export const useEditPlayerContact = (playerCode, data) => {
  let url = playerCode ? `${API}/${playerCode}/contact` : ""
  return usePutData(url, data)
}

export const useAddPlayerBank = (playerCode, data) => {
  let url = playerCode ? `${API}/${playerCode}/bank` : ""
  return usePostData(url, data)
}

export const useEditPlayerBank = ({ playerCode, id } = {}, data) => {
  let url = playerCode && id ? `${API}/${playerCode}/bank/${id}` : ""
  return usePutData(url, data)
}

export const useDeletePlayerBank = (playerCode, id) => {
  let url = playerCode && id ? `${API}/${playerCode}/bank/${id}` : ""
  return useDelete(url)
}

export const useEditPlayerPassword = (playerCode, data) => {
  let url = playerCode ? `${API}/${playerCode}/password` : ""
  return usePutData(url, data)
}

export const useOperations = (playerCode, searchParams) => {
  let url = playerCode
    ? urlWith(searchParams, `${API}/${playerCode}/operations`)
    : ""
  return useGet(url)
}

export const useBettings = (playerCode, searchParams) => {
  let url = playerCode
    ? urlWith(searchParams, `${API}/${playerCode}/bettings`)
    : ""
  return useGet(url)
}

export const usePlayerBalanceChanges = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/accountChanges`) : ""
  return useGet(url)
}

export const usePlayerBalanceChangeTotalAmount = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/accountChanges/totalAmount`)
    : ""
  return useGet(url)
}

export const useClearPlayerWageringRequirement = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}/clear` : ""
  return usePutData(url, true)
}

export const usePlayerPromotions = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams
      ? urlWith(searchParams, `${API}/${playerCode}/joinedPromotions`)
      : ""
  return useGet(url)
}

export const usePlayerTransferWalletList = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}/transferwallet` : ""

  return useGet(url)
}

export const usePlayerMainWallet = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}/mainwallet` : ""

  return useGet(url)
}

const PlayerIdentityApi = "/api/playeridentity"
export const usePlayerIdentity = (playerCode) => {
  let url = playerCode ? `${PlayerIdentityApi}/${playerCode}/identity` : ""
  return useGet(url)
}

export const useVerifyPlayerID = (formId, data) => {
  let url = formId ? `${PlayerIdentityApi}/${formId}` : ""
  return usePostData(url, data)
}

export const usePlayerWageringRequirementList = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams
      ? urlWith(searchParams, `${API}/${playerCode}/playerBuckets`)
      : ""
  return useGet(url)
}

export const usePlayerCompletedWageringList = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams
      ? urlWith(searchParams, `${API}/${playerCode}/playerBucketHistories`)
      : ""
  return useGet(url)
}
