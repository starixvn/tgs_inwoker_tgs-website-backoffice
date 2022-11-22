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

let API = "/api/DepositAccumulateRoulette"

export const usePromotionWinningList = (brandId, searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/records/${brandId}`)
    : ""
  return useGet(url)
}

export const usePromotionWinningDetail = (brandId, recordId) => {
  let url = id
    ? urlWith(searchParams, `${API}/detail/${brandId}/${recordId}`)
    : ""
  return useGet(url)
}
