import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { sortBy, groupBy } from "lodash"
import { groupWith, eqProps, propEq } from "ramda"
import clone from "clone-deep"

export const API = "/api/LicenseeMarketReport"

export const useLicenseeMarketReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  let { data, ...rest } = useGet(url)

  let items = data?.datas?.items
    ? groupWith(eqProps("currencyCode"), data.datas.items)
    : undefined

  items = items?.reduce?.((acc, items, index, list) => {
    let [{ currencyCode }] = items
    if (includesMultipleCurrency(currencyCode)) {
      return acc //filter out platform contains multiple currency
    }

    let sortedByBrandCodeItems = sortBy(items, ["brandCode"])
    acc.push(...clone(sortedByBrandCodeItems))

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
