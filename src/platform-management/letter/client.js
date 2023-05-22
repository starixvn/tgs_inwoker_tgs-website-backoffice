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

const InboxAPI = "/api/station-letter"

export const useLetterList = (brandId, letterBoxType, searchParams) => {
  let url =
    brandId && letterBoxType && searchParams
      ? urlWith(searchParams, `${toLetterBoxAPI(letterBoxType)}/${brandId}`)
      : ""
  return useGet(url)
}

const toLetterBoxAPI = (value) => {
  switch (value) {
    case LetterBoxType.Sent:
      return SentAPI
    case LetterBoxType.Inbox:
    default:
      return InboxAPI
  }
}

export const useSendLetter = (brandId, data) => {
  let url = brandId && data ? `${InboxAPI}/${brandId}` : ""
  return usePutData(url, data)
}

export const useReplyLetter = (brandId, letterId, data) => {
  let url = brandId && letterId && data ? `${InboxAPI}/${brandId}:reply` : ""
  return usePutData(url, data)
}

const SentAPI = "/api/delivery-box"
export const useSentLetter = (brandId, letterId) => {
  let url = brandId && letterId ? `${SentAPI}/${letterId}` : ""
  return useGet(url)
}
