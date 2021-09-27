import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

//TODO: use licensee market report api
const API = "/api/MarketReport"

export const useMarketReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}
