import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { isDev } from "../../env"
import { head } from "lodash-es"

export const API = "/api/BrandGameProviderReport"

export const useGameProviderReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/v2`) : ""
  let { data, ...rest } = useGet(url)

  let currencyCode = head(data?.datas?.items)?.currencyCode
  let total = data?.totals?.find((total) => total.currencyCode === currencyCode)

  return {
    data: data?.datas
      ? {
          ...data?.datas,
          total
        }
      : undefined,
    ...rest
  }
}
