import {
  urlWith,
  get,
  put,
  post,
  useGet,
  usePut,
  usePostData,
  usePutData,
  usePostFormData,
  useDelete
} from "../../client"
import { useApiMerge } from "../../client/useApiMerge."
import { useEnablePlatformSms } from "../../merchant/platforms/client"
import { useApplyPlatformSms } from "../../sms/client"

let API = "/api/BrandCommunication"

export const usePlatformMessengerList = (brandId) => {
  let url = brandId ? `${API}/${brandId}` : ""
  return useGet(url)
}

export const useAddPlatformMessenger = (data) => {
  return usePostData(API, data)
}

export const useUpdatePlatformMessenger = (id, data) => {
  let url = data ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useDeletePlatformMessenger = (id) => {
  let url = id ? `${API}/${id}` : ""
  return useDelete(url)
}

const LiveChatAPI = "/api/BrandLiveChat"
export const usePlatformLiveChat = (brandId) => {
  let url = brandId ? `${LiveChatAPI}/${brandId}` : ""
  return useGet(url)
}

export const useAddPlatformLiveChat = (formData) => {
  let url = formData ? `${LiveChatAPI}` : ""
  return usePostData(url, formData)
}

export const useUpdatePlatformLiveChat = (brandId, data) => {
  let url = brandId && data ? `${LiveChatAPI}/${brandId}` : ""
  return usePutData(url, data)
}

export const useDeletePlatformLiveChat = (brandId) => {
  let url = brandId ? `${LiveChatAPI}/${brandId}` : ""
  return useDelete(url)
}

export const usePlatformAgentDividendCondition = (brandId) => {
  let url = brandId ? `/api/BrandAgentDividendCondition/${brandId}` : ""
  return useGet(url)
}

export const useUpdatePlatformAgentDividendCondition = (data) => {
  let url = data?.brandId ? `/api/BrandAgentDividendCondition` : ""
  return usePutData(url, data)
}
