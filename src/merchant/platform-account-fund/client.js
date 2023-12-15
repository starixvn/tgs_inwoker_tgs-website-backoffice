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

//TODO: fake api
export const useUpdatePlatformAccountFund = (brandId, type, formData) => {
  //TODO: rm fake impl
  return {
    isLoading: false,
    result: formData ? true : false,
    mutate: () => {},
    deleteCache: () => {}
  }
}

export const useAddPlatformAccountFund = (brandId, formData) => {}

export const useDeductPlatformAccountFund = (brandId, formData) => {}
