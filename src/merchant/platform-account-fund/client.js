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

export const FundType = {
  Add: "Add",
  Deduct: "Deduct"
}

export const useUpdatePlatformAccountFund = (brandId, fundType, formData) => {
  if (fundType === FundType.Add) {
    return useAddPlatformAccountFund(brandId, formData)
  } else if (fundType === FundType.Deduct) {
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

export const useAddPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${API}/${brandId}/credit` : ""
  return usePostData(url, formData)
}

export const useDeductPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${API}/${brandId}/debit` : ""
  return usePostData(url, formData)
}
