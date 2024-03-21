import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

export const API = "/api/PlayerReport"

export const useBalanceChangeReportList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/playersAccountChanges`)
    : ""
  return useGet(url)
}
