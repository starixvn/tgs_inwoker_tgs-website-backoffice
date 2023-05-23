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

export const useAddLetter = (brandId, data) => {
  let url = brandId && data ? `${InboxAPI}/${brandId}` : ""
  return usePutData(url, data)
}

export const useReplyLetter = (brandId, letterId, data) => {
  let url = brandId && letterId && data ? `${InboxAPI}/${brandId}:reply` : ""
  return usePutData(url, data)
}
