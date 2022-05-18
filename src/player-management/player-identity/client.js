import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete,
  usePostFormData
} from "../../client"
import { useUploadImage } from "../../file/upload/client"

let API = "/api/playeridentity"

export const usePlayerIdentityList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlayerIdentity = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}/identity` : ""
  return useGet(url)
}

export const useVerifyPlayerID = (formId, data) => {
  let url = formId ? `${API}/${formId}` : ""
  return usePostData(url, data)
}

export const useUploadPlayerIdentityAttachment = (
  brandId,
  playerCode,
  body
) => {
  let url =
    brandId && playerCode && body
      ? `${API}/${brandId}/${playerCode}/upload`
      : ""
  return usePostFormData(url, body)
}
