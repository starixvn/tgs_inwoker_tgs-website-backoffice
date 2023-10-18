import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/dar"

export const usePromotionWinningList = (brandId, searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/records/${brandId}`)
    : ""
  return useGet(url)
}

export const usePromotionWinningDetail = (brandId, recordId) => {
  let url = brandId && recordId ? `${API}/detail/${brandId}/${recordId}` : ""
  return useGet(url)
}
