import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete,
  usePostFormData,
  usePatchData
} from "../client"

const API = "/api/sms"

export const useSmsList = (options) => {
  let url = API
  return useGet(url, options)
}

export const useAddSms = (formData) => {
  let url = formData ? API : ""
  return usePostData(url, formData)
}

export const useUpdateSms = (settingId, formData) => {
  let url = settingId && formData ? `${API}/${settingId}` : ""
  return usePutData(url, formData)
}

export const useDeleteSms = (settingId) => {
  let url = settingId ? `${API}/${settingId}` : ""
  return useDelete(url)
}

const PlatformApi = "/api/brand/sms"
export const usePlatformSms = (brandId) => {
  let url = brandId ? `${PlatformApi}/${brandId}` : ""
  return useGet(url)
}

export const usePlatformSmsList = (brandId) => {
  let url = brandId ? `${PlatformApi}/options/${brandId}` : ""
  return useGet(url)
}

/*
 formData = { smsSettingId }
*/
export const useAddPlatformSms = (brandId, formData) => {
  let url = brandId && formData ? `${PlatformApi}/${brandId}` : ""
  return usePostData(url, formData)
}

export const useDeletePlatformSms = (brandId, smsSettingId) => {
  let url =
    brandId && smsSettingId ? `${PlatformApi}/${brandId}/${smsSettingId}` : ""
  return useDelete(url)
}

export const useApplyPlatformSms = (brandId, smsSettingId) => {
  let url = brandId && smsSettingId ? `${PlatformApi}/apply/${brandId}` : ""
  return usePatchData(url, smsSettingId)
}
