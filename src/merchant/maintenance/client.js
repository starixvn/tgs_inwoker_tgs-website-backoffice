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

export const useMaintenanceList = ({
  hideArchieved = true,
  ...searchParams
} = {}) => {
  let url = searchParams ? urlWith(searchParams, API) : ""

  let { data, ...rest } = useGet(url)

  let items = hideArchieved
    ? data?.items?.filter?.(({ status }) => status != MerchantStatus.Archived)
    : data?.items

  return {
    data: items ? { ...data, items } : data,
    ...rest
  }
}

export const useUpdateMaintenance = (data) => {
  let url = data ? `${API}/batchupdatetime` : ""
  return usePutData(url, data)
}
