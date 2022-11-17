import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete
} from "../../client"
//TODO: rm after api done
import { usePromotionList, usePromotionRule } from "../promotion-list/client"

let API = "/api/promotion"

export const usePromotionWinningList = (searchParams) => {
  //TODO: test only, remove after api done
  return usePromotionList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePromotionWinningDetail = (id) => {
  //TODO: test only, remove after api done
  return usePromotionRule(id)

  let url = id ? urlWith(searchParams, `${API}/${id}`) : ""
  return useGet(url)
}
