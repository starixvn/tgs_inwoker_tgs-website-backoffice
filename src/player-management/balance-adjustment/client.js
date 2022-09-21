import {
  urlWith,
  useGet,
  usePostData,
  usePostFormData,
  usePutData,
  useDelete,
  useHead
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
  return usePostFormData(url, formData)
}

export const usePlayerBatchAddBalanceList = (batchId) => {
  let url = batchId ? `${BatchApi}/${batchId}` : ""
  return useGet(url)
}

export const useStartPlayerBatchAddBalance = (brandId, batchId, formData) => {
  let url =
    brandId && batchId && formData ? `${BatchApi}/${brandId}/${batchId}` : ""
  return usePutData(url, formData)
}

export const useIsPlayerBatchAddBalanceEnd = (batchId) => {
  let url = batchId ? `${BatchApi}/${batchId}` : ""
  return useHead(url)
}
