import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

const API = "/api/PlatformCredit"

export const usePlatformCreditList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlatformCredit = (id) => {
  let url = id ? `${API}/${id}` : ""
  return useGet(url)
}

export const useUpdatePlatformCredit = (id, amount) => {
  let url = id && amount ? `${API}/${id}/${amount}` : ""
  return usePutData(url, amount)
}

export const usePlatformCreditPayment = (id, amount) => {
  let url = id && amount ? `${API}/${id}/pay/${amount}` : ""
  return usePutData(url, amount)
}

export const usePlatformCreditPaymentList = (id, searchParams) => {
  let url =
    id && searchParams
      ? urlWith(searchParams, `${API}/${id}/paymentRecords`)
      : ""
  return useGet(url)
}
