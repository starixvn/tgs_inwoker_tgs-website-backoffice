import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../client"

const API = "/api/BetLimit"

export const useBetLimitList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useBetLimit = (id) => {
  let url = id ? `${API}/${id}` : ""
  return useGet(url)
}

export const useAddBetLimit = (data) => {
  let url = data ? API : ""
  return usePostData(url, data)
}

export const useUpdateBetLimit = (id, data) => {
  let url = id ? `${API}/${id}` : ""
  return usePutData(url, data)
}
