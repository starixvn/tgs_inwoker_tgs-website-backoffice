import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

const API = "/api/PlayerDepositReport"

export const usePlayerDepositReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useFirstDepositPlayerList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/playerFirstDepositDetails`)
    : ""
  return useGet(url)
}

export const useNoSecondDepositPlayerList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/playerNoSecondDepositDetails`)
    : ""
  return useGet(url)
}

export const useDailyDepositPlayerList =  (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/playerDailyDepositDetails`)
    : ""
  return useGet(url)
}