import useSWR, { cache } from "swr"
import client, {
  urlWith,
  get,
  put,
  post,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { BoxType } from "./BoxType"
import { LetterType } from "./LetterType"

const InboxAPI = "/api/station-letter"

const SentAPI = "/api/delivery-box"

const toLetterBoxAPI = (value) => {
  switch (value) {
    case BoxType.Sent:
      return SentAPI
    case BoxType.Inbox:
    default:
      return InboxAPI
  }
}

export const useLetterList = (brandId, boxType, searchParams) => {
  let url =
    brandId && boxType && searchParams
      ? urlWith(searchParams, `${toLetterBoxAPI(boxType)}/${brandId}`)
      : ""
  return useGet(url)
}

export const useLetter = (brandId, boxType, letterId) => {
  let url =
    brandId && boxType && letterId
      ? `${toLetterBoxAPI(boxType)}/${brandId}/${letterId}`
      : ""
  return useGet(url)
}

export const useSendLetter = (brandId, letterType, data) => {
  let url =
    brandId && letterType && data
      ? `${InboxAPI}/${toSendLetterPath(letterType)}/${brandId}`
      : ""
  return usePutData(url, data)
}

const toSendLetterPath = (value) => {
  switch (value) {
    case LetterType.DesignatedPlayers:
      return "player"
    case LetterType.AllPlayers:
    default:
      return "all"
  }
}

export const useReplyLetter = (brandId, letterId, data) => {
  let url =
    brandId && letterId && data
      ? `${InboxAPI}/${brandId}/${letterId}:reply`
      : ""
  return usePutData(url, data)
}
