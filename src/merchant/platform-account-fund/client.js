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

const API = "/api/PlatformAccountFund"

//TODO: brandId param?
export const usePlatformAccountFundList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""

  //TODO: rm
  let { data, ...rest } = usePlatformCreditList(searchParams)
  let items = data?.items?.map((item, index) => {
    return {
      type: index % 2 === 0 ? "Settled" : "Reset",
      createdOn: item.createdOn
    }
  })

  return {
    data: {
      ...data,
      items
    },
    ...rest
  }
}
