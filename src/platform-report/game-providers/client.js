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

  return {
    data: data?.datas
      ? {
          ...data?.datas,
          total: data.total
        }
      : undefined,
    ...rest
  }
}
