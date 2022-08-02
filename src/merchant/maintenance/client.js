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

const API = "/api/BrandMaintenance"

export const useMaintenanceList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""

  return useGet(url)
}

export const useUpdateAllMaintenance = (data) => {
  let url = data ? `${API}/updatealltime` : ""
  return usePutData(url, data)
}

export const useUpdateMaintenance = (data) => {
  let url = data ? `${API}/batchupdatetime` : ""
  return usePutData(url, data)
}

export const useMaintenanceMessage = (id) => {
  let url = id ? `${API}/${id}` : ""
  return useGet(url)
}

export const useUpdateMaintenanceMessage = (id, data) => {
  let url = data ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useStartMaintenance = (start) => {
  let url = start ? `${API}/allmaintain` : ""
  return usePut(url)
}
