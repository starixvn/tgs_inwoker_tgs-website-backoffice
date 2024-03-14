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
import { isDev } from "../../env"

//TODO: use new api instead
export const API = "/api/BrandGameProviderReport"

//TODO: use new api instead
export const useGameProviderReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}
