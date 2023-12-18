import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { faker } from "@faker-js/faker"
import { isObject } from "lodash-es"

const API = "/api/brandgamecredit"

export const usePlatformAccountFund = (brandId) => {
  let url = brandId ? `${API}/${brandId}/current` : ""
  let { isLoading, data, ...rest } = useGet(url)
  return {
    isLoading,
    data: isLoading
      ? null
      : {
          resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
          resellerCode: "TGS",
          licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
          licenseeCode: "TGS",
          brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
          brandCode: "GPI",
          month: "2023-12-01",
          initialAmount: 0,
          creditAmount: 1112,
          debitAmount: 1012,
          profitAmount: 0,
          creditLimit: 100,
          creditUsed: 0,
          creditUsedPer: 0,
          creditAvailable: 100,
          creditAvailablePer: 100,
          creditRiskType: "NormalRisk",
          createdOn: "2023-12-05T10:25:06.333385+00:00",
          updatedOn: "2023-12-15T09:25:10.592835+00:00"
        },
    ...rest
  }
}

export const usePlatformAccountFundHistory = (brandId) => {
  let { data, ...rest } = usePlatformAccountFund()
  if (isObject(data)) {
    data = [data]
  }
  return {
    data,
    ...rest
  }
}

export const TxType = {
  Add: "Add",
  Deduct: "Deduct"
}

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

const TxApi = "/api/brandgamecredittxn"
export const useAddPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/credit` : ""
  return usePostData(url, formData)
}

export const useDeductPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/debit` : ""
  return usePostData(url, formData)
}
