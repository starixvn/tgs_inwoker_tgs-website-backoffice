import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData,
  useDelete,
  usePatchData
} from "../../client"
import { MerchantStatus } from "../MerchantStatus"
import { isNil, complement } from "ramda"

const notNil = complement(isNil)

const API = "/api/brand"

export const useBrandList = (searchParams, options) => {
  const DefaultHideArchieved = true
  let hideArchieved = options?.hideArchieved ?? DefaultHideArchieved
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

export const useBrandLogo = (id, options) => {
  let url = id ? `${API}/logo/${id}` : ""
  let { data, ...rest } = useGet(url, options)
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

export const useBrandToken = (id) => {
  let url = id ? `${API}/token/${id}` : ""
  return useGet(url)
}

const ContactApi = "/api/notecontbrand"
export const useBrandContacts = (id) => {
  let url = id ? `${ContactApi}/${id}/email` : ""
  return useGet(url)
}

export const useUpdateBrandContacts = (id, formData) => {
  let url = id && formData ? `${ContactApi}/${id}/email` : ""
  return usePostData(url, formData, {
    dropEmptyValuesDisabled: true
  })
}

export const usePlatformAccountFundSetting = (id) => {
  let url = id ? `${API}/platform-account-fund/${id}` : ""
  return useGet(url)
}

export const useUpdatePlatformAccountFundSetting = (id, formData) => {
  let url = id && notNil(formData) ? `${API}/platform-account-fund/${id}` : ""
  return usePatchData(url, formData)
}

//TODO: api integration
export const usePlatformGameTypeFeeSetting = (id) => {
  //TODO: rm fake data
  let { data, ...rest } = useBrandLogo(id)
  if (data) {
    let setting = sessionStorage.getItem("fee")
    data = setting
      ? JSON.parse(setting)
      : {
          liveDealer: 1,
          sports: 2,
          eGame: 3,
          cardGame: 4,
          lottery: 5,
          virtualSports: 6
        }
  }
  return { data, ...rest }
}

//TODO: api integration
export const useUpdatePlatformGameTypeFeeSetting = (id, formData) => {
  let { data: result, ...rest } = useBrandLogo(id)
  if (formData) {
    sessionStorage.setItem("fee", JSON.stringify(formData))
  }
  return {
    result: formData ? true : undefined,
    ...rest
  }
}
