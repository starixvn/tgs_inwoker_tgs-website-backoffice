import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { isAddFund, isDeductFund } from "./FundAction"

const API = "/api/brandgamecredit"

export const usePlatformAccountFund = (brandId) => {
  let url = brandId ? `${API}/${brandId}/current` : ""
  return useGet(url)
}

export const usePlatformAccountFundHistory = (brandId) => {
  let url = brandId ? `${API}/${brandId}/histories` : ""
  return useGet(url)
}

export const useUpdatePlatformAccountFund = (
  brandId,
  type,
  formData,
  options = {
    dropEmptyValuesDisabled: true
  }
) => {
  if (isAddFund(type)) {
    return useAddPlatformAccountFund(brandId, formData, options)
  } else if (isDeductFund(type)) {
    return useDeductPlatformAccountFund(brandId, formData, options)
  }

  let url = "" //empty
  return usePostData(url)
}

const TxApi = "/api/brandgamecredittxn"
export const useAddPlatformAccountFund = (brandId, formData, options) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/credit` : ""
  return usePostData(url, formData, options)
}

export const useDeductPlatformAccountFund = (brandId, formData, options) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/debit` : ""
  return usePostData(url, formData, options)
}

export const usePlatformAccountFundActionDetail = (brandId, searchParams) => {
  let url =
    brandId && searchParams
      ? urlWith(searchParams, `${TxApi}/${brandId}/query`)
      : ""
  return useGet(url)
}

const ProfitApi = "/api/brandgamecreditprofit"
export const usePlatformAccountFundCreditUsedDetail = (
  brandId,
  searchParams
) => {
  let url =
    brandId && searchParams
      ? urlWith(searchParams, `${ProfitApi}/${brandId}/query`)
      : ""
  let { data, ...rest } = useGet(url)

  //TODO: need to process profitAmount?
  /*
  data = data?.map(({ profitAmount, ...item }) => ({
    ...item,
    profitAmount: profitAmount < 0 ? 0 : profitAmount
  }))
  */

  return {
    data,
    ...rest
  }
}

const AlertSettingApi = "/api/brandgamecreditsuspsetting"
export const usePlatformAccountFundAlertSetting = (brandId) => {
  let url = brandId ? `${AlertSettingApi}/${brandId}` : ""
  return useGet(url)
}

export const useUpdatePlatformAccountFundAlertSetting = (brandId, formData) => {
  let url = brandId ? `${AlertSettingApi}/${brandId}` : ""
  return usePostData(url, formData)
}
