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
import { isDev } from "../../env"

export const API = "/api/BrandGameProviderReport"

export const useGameProviderReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  let { data, ...rest } = useGet(url)

  let items = data?.datas?.items
    ? groupWith(eqProps("currencyCode"), data.datas.items)
    : undefined

  items = items?.reduce?.((acc, items, index, list) => {
    let [{ currencyCode }] = items

    let total = data?.totals?.find(propEq("currencyCode", currencyCode))
    if (total) {
      let row = {
        ...clone(total),
        isTotal: true
      }
      acc.push(row)
    }

    let sortedItems = sortBy(items, ["gameProviderName"])
    acc.push(...clone(sortedItems))

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
