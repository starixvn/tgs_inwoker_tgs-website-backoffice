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

export const API = "/api/GameProviderReport"

export const useGameProviderReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useUpdateGameProviderReport = (data) => {
  let url = data ? `${API}/generate` : ""
  return usePostData(url, data)
}

const PlatformApi = "/api/BrandGameProviderReport"
export const useUpdatePlatformGameProviderReport = (data) => {
  let url = data ? `${PlatformApi}/generate` : ""
  return usePostData(url, data)
}
