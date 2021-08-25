import useSWR, { cache } from "swr"
import client, {
  urlWith,
  get,
  put,
  post,
  useGet,
  usePut,
  usePostData,
  usePutData,
  usePostFormData,
  usePatchData
} from "../../client"

let API = "/api/banner"

export const usePlatformBannerList = (brandId, status, searchParams) => {
  let url =
    brandId && status && searchParams
      ? urlWith(searchParams, `${API}/${status}/${brandId}`)
      : ""

  return useGet(url)
}

export const usePlatformBanner = (brandId, bannerId) => {
  let url = brandId && bannerId ? `${API}/${brandId}/${bannerId}` : ""
  let { data, ...rest } = useGet(url)
  return {
    data: data?.data,
    ...rest
  }
}

export const useAddPlatformBanner = (brandId, data) => {
  let url = brandId && data ? `${API}/${brandId}` : ""
  return usePutData(url, data)
}

export const useUpdatePlatformBanner = (brandId, bannerId, data) => {
  let url = brandId && bannerId && data ? `${API}/${brandId}/${bannerId}` : ""
  return usePatchData(url, data)
}

export const useVerifyPlatformBanner = (brandId, bannerId, data) => {
  let url = brandId && bannerId && data ? `${API}/${brandId}/${bannerId}` : ""
  return usePostData(url, data)
}

export const useChangePlatformBannerOrders = (
  brandId,
  bannerId,
  orderNumber
) => {
  let url =
    brandId && bannerId && orderNumber
      ? `${API}/${brandId}/${bannerId}/${orderNumber}`
      : ""
  return usePatchData(url)
}

export const useChangePlatformBannerStatus = (brandId, bannerId, status) => {
  let url =
    brandId && bannerId && status
      ? `${API}/${status}/${brandId}/${bannerId}`
      : ""
  return usePatchData(url)
}
