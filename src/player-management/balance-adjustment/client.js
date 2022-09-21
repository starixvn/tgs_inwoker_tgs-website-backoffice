import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/player"

export const usePlayerAdjustmentList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlayerAdjustIncreaseBalance = (playerCode, formData) => {
  let url = playerCode && formData ? `${API}/${playerCode}/adjust/increase` : ""
  return usePostData(url, formData)
}

export const usePlayerAdjustReduceBalance = (playerCode, formData) => {
  let url = playerCode && formData ? `${API}/${playerCode}/adjust/reduce` : ""
  return usePostData(url, formData)
}

let BatchApi = "/api/batch-adj-balance"
export const useImportPlayerBatchAddBalance = (brandId, formData) => {
  let url = brandId && formData ? `${BatchApi}/${brandId}` : ""
  return usePostData(url, formData)
}
