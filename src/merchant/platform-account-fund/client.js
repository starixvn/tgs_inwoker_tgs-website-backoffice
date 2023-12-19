import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { usePlatformCreditList } from "../platform-credit/client"
import { faker } from "@faker-js/faker"
import { useBrand } from "../platforms/client"
import { FundAction, isAddFund, isDeductFund } from "./FundAction"

const API = "/api/brandgamecredit"

export const usePlatformAccountFund = (brandId) => {
  let url = brandId ? `${API}/${brandId}/current` : ""
  return useGet(url)
}

export const usePlatformAccountFundHistory = (brandId) => {
  let url = brandId ? `${API}/${brandId}/histories` : ""
  return useGet(url)
}

export const useUpdatePlatformAccountFund = (brandId, type, formData) => {
  if (isAddFund(type)) {
    return useAddPlatformAccountFund(brandId, formData)
  } else if (isDeductFund(type)) {
    return useDeductPlatformAccountFund(brandId, formData)
  }

  let url = "" //empty
  return usePostData(url)
}

const TxApi = "/api/brandgamecredittxn"
export const useAddPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/credit` : ""
  return usePostData(url, formData)
}

export const useDeductPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/debit` : ""
  return usePostData(url, formData)
}

export const usePlatformAccountFundActionDetail = (brandId, searchParams) => {
  let url =
    brandId && searchParams
      ? urlWith(searchParams, `${TxApi}/${brandId}/query`)
      : ""
  return useGet(url)
}
