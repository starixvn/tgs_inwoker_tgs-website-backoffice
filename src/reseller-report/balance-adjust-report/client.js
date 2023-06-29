import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { UserType } from "./UserType"

const API = "/api/adjust-wallet"

export const useBalanceAdjustReportList = (searchParams) => {
  let url =
    searchParams?.resellerId && searchParams
      ? urlWith(searchParams, `${API}/summary/${searchParams?.resellerId}`)
      : ""

  return useGet(url)
}

const toAdjustListPath = (value) => {
  switch (value) {
    case UserType.Player:
      return "player"
    case UserType.Agent:
      return "agent"
    default:
      return ""
  }
}

export const usePlatformAdjustList = (brandId, userType, searchParams) => {
  let path = toAdjustListPath(userType)
  let url =
    brandId && path ? urlWith(searchParams, `${API}/${path}/${brandId}`) : ""

  return useGet(url)
}

export const exportBalanceAdjustListPath = (resellerId, searchParams) => {
  return resellerId && searchParams
    ? urlWith(searchParams, `${API}/summary/${resellerId}:export`)
    : ""
}

export const exportPlatformAdjustListPath = (
  brandId = "",
  userType,
  searchParams
) => {
  let path = toAdjustListPath(userType)
  let url =
    brandId && path && searchParams
      ? urlWith(searchParams, `${API}/${path}/${brandId}:export`)
      : ""
  return url
}
