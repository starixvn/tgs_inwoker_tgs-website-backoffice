import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { useBrandList, useBrand } from "../platforms/client"

const API = "/api/brand"

export const usePlatformCreditList = (searchParams) =>
  useBrandList(searchParams)

export const usePlatformCredit = (id) => useBrand(id)

export const useEditPlatformCredit = (id, data) => {
  let url = id ? `${API}/${id}/credit` : ""
  return usePutData(url, data)
}

export const usePayPlatformCredit = (id, formData) => {
  let url = id && formData ? `${API}/${id}/pay` : ""
  return usePostData(url, formData)
}

export const usePlatformCreditHistoryList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/history`) : ""
  return useGet(url)
}
