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

const API = "/api/PlatformAccountFund"

export const usePlatformAccountFund = (brandId) => {
  //TODO: url
  let url = brandId ? `${API}/${brandId}` : ""

  //TODO: rm
  let result = useBrand(brandId)
  return result
}
