import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/PromotionDispatch"

export const usePromotionPayoutList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useSendPromotionPayout = (formData) => {
  let url = formData ? `${API}` : ""
  return usePostData(url, formData)
}

//TODO: Approve & Reject apis or field?
export const useVerifyPromotionPayout = (formData) => {
  //TODO: use other api instead?
  return useSendPromotionPayout(formData)
}
