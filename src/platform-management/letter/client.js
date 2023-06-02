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
import { LetterBoxType } from "./LetterBoxType"
import { SendLetterType } from "./SendLetterType"

const InboxAPI = "/api/station-letter"

const SentAPI = "/api/delivery-box"

const toLetterBoxAPI = (value) => {
  switch (value) {
    case LetterBoxType.Sent:
      return SentAPI
    case LetterBoxType.Inbox:
    default:
      return InboxAPI
  }
}

export const useLetterList = (brandId, letterBoxType, searchParams) => {
  let url =
    brandId && letterBoxType && searchParams
      ? urlWith(searchParams, `${toLetterBoxAPI(letterBoxType)}/${brandId}`)
      : ""
  return useGet(url)
}

export const useLetter = (brandId, letterBoxType, letterId) => {
  let url =
    brandId && letterBoxType && letterId
      ? `${toLetterBoxAPI(letterBoxType)}/${brandId}/${letterId}`
      : ""
  return useGet(url)
}

export const useSendLetter = (brandId, sendLetterType, data) => {
  let url =
    brandId && sendLetterType && data
      ? `${InboxAPI}/${toSendLetterPath(sendLetterType)}/${brandId}`
      : ""
  return usePutData(url, data)
}

const toSendLetterPath = (value) => {
  switch (value) {
    case SendLetterType.DesignatedPlayers:
      return "player"
    case SendLetterType.AllPlayers:
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
