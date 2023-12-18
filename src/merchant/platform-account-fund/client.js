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

const API = "/api/brandgamecredit"

export const usePlatformAccountFund = (brandId) => {
  let url = brandId ? `${API}/${brandId}/current` : ""
  return useGet(url)
}

export const usePlatformAccountFundHistory = (brandId) => {
  let url = brandId ? `${API}/${brandId}/histories` : ""
  return useGet(url)
}

export const TxType = {
  Add: "Add",
  Deduct: "Deduct"
}

//TODO: cause hook err?
/*
export const useUpdatePlatformAccountFund = (brandId, fundType, formData) => {
  if (fundType === TxType.Add) {
    return useAddPlatformAccountFund(brandId, formData)
  } else if (fundType === TxType.Deduct) {
    return useDeductPlatformAccountFund(brandId, formData)
  }

  // empty result
  return {
    isLoading: false,
    result: false,
    mutate: () => {},
    deleteCache: () => {}
  }
}
*/

const TxApi = "/api/brandgamecredittxn"
export const useAddPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/credit` : ""
  return usePostData(url, formData)
}

export const useDeductPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/debit` : ""
  return usePostData(url, formData)
}
