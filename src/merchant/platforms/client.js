import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData,
  useDelete
} from "../../client"
import { MerchantStatus } from "../MerchantStatus"

const API = "/api/brand"

export const useBrandList = ({
  hideArchieved = true,
  ...searchParams
} = {}) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  let { data, ...rest } = useGet(url)

  let items = hideArchieved
    ? data?.items?.filter?.(({ status }) => status != MerchantStatus.Archived)
    : undefined

  return {
    data: items ? { ...data, items } : data,
    ...rest
  }
}

export const useBrand = (id) => {
  let url = id ? `${API}/${id}` : ""
  let { data, ...rest } = useGet(url)
  return {
    data: data?.brand,
    ...rest
  }
}

export const useAddBrand = (data) => {
  let url = data ? API : ""
  return usePostData(url, data)
}

export const useUpdateBrand = (id, data) => {
  let url = id ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useChangeBrandStatus = (id, status) => {
  let url = id && status ? `${API}/${id}/${status}` : ""
  return usePut(url)
}

export const useSyncBrandGameList = (id) => {
  let url = id ? `${API}/${id}/syncGames` : undefined
  return useGet(url)
}

export const useBrandLogo = (id) => {
  let url = id ? `${API}/logo/${id}` : ""
  let { data, ...rest } = useGet(url)
  return {
    data: data?.data,
    ...rest
  }
}

export const useUpdateBrandLogo = (formData) => {
  let url = formData ? `${API}/logo` : ""
  return usePutData(url, formData)
}

export const useDeleteBrandLogo = (id) => {
  let url = id ? `${API}/${id}` : ""
  return useDelete(url)
}

/*
export const useBrandAgentProfitSharingType = (brandId) => {
}
*/
