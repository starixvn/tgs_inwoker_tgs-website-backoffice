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
  usePostFormData
} from "../../client"
import {
  useAnnouncementList,
  useChangeAnnouncementOrders
} from "../announcement/client"

let API = "/api/banner"

export const usePlatformBannerList = (searchParams) => {
  return useAnnouncementList(searchParams)

  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useVerifyePlatformBanner = ({ id, type }, data) => {
  let url = !!id && !!type ? `${API}/${id}/${type}` : ""
  return usePutData(url, data)
}

export const usePlatformBanner = (id, data) => {
  let url = id ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useAddPlatformBanner = (data) => {
  return usePostData(API, data)
}

export const useUpdatePlatformBanner = (id, data) => {
  let url = id ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useVerifyPlatformBanner = ({ id, type }, data) => {
  let url = !!id && !!type ? `${API}/${id}/${type}` : ""
  return usePutData(url, data)
}

export const useChangePlatformBannerOrders = (data) => {
  return useChangeAnnouncementOrders(data)

  let url = `${API}/changeorders`
  return usePutData(url, data)
}

export const useChangePlatformBannerStatus = (id, status) => {
  let url = id && status ? `${API}/${id}/status/${status}` : ""

  return usePut(url)
}
