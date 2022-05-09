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

const PlayerIdentityApi = "/api/playeridentity"
export const usePlayerIdentity = (playerCode) => {
  let url = playerCode ? `${PlayerIdentityApi}/${playerCode}/identity` : ""
  return useGet(url)
}

export const useVerifyPlayerID = (formId, data) => {
  let url = formId ? `${PlayerIdentityApi}/${formId}` : ""
  return usePostData(url, data)
}
