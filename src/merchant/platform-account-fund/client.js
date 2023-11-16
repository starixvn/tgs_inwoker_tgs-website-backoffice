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
  console.log("TODO: api url? ", url)

  //TODO: rm
  let { data, ...rest } = usePlatformCreditList(searchParams)
  let items = data?.items?.map((item, index) => {
    console.log("item", item)
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
