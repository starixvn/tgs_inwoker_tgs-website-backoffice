import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete
} from "../../client"
import { usePromotionList } from "../promotion-list/client"

let API = "/api/promotion"

export const usePromotionWinningList = (searchParams) => {
  //TODO: test only, remove after api done
  return usePromotionList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}
