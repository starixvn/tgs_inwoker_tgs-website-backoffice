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
  useDelete
} from "../../client"

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
