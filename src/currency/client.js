import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../client"

const API = "/api/currency"

export const useCurrencyList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useAddCurrency = (data) => {
  let url = data ? API : ""
  return usePostData(url, data)
}

export const useUpdateCurrency = (code, data) => {
  let url = code && data ? `${API}/${code}` : ""
  return usePutData(url, data)
}
