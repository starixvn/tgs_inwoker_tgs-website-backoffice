import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { sortBy } from "lodash-es"
import { groupWith, eqProps, propEq } from "ramda"
import clone from "clone-deep"

export const API = "/api/ResellerMarketReport"

export const useResellerMarketReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  let { data, ...rest } = useGet(url)

  let items = data?.datas?.items
    ? groupWith(eqProps("currencyCode"), data.datas.items)
    : undefined

  items = items?.reduce?.((acc, items, index, list) => {
    let [{ currencyCode }] = items

    //TODO: needed?
    /*
    if (includesMultipleCurrency(currencyCode)) {
      return acc //filter out licensee contains multiple currency
    }
    */

    let sortedByLicenseeCodeItems = sortBy(items, ["licenseeCode"])
    acc.push(...clone(sortedByLicenseeCodeItems))

    let total = data?.totals?.find(propEq("currencyCode", currencyCode))
    if (total) {
      let row = {
        ...clone(total),
        isTotal: true
      }
      acc.push(row)
    }

    return acc
  }, [])

  return {
    data: items
      ? {
          ...data.datas,
          items
        }
      : undefined,
    ...rest
  }
}

const includesMultipleCurrency = (currencyCode = "") =>
  currencyCode.split(",").length > 1
