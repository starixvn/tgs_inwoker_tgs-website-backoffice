import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData,
  usePatchData
} from "../../client"

const API = "/api/brandpayment"

export const useBrandPaymentList = (searchParams, options) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url, options)
}

export const useBrandPayment = (id) => {
  let url = id ? `${API}/info/${id}` : ""
  return useGet(url)
}

export const useAddDepositBrandPayment = (data) => {
  let url = data ? `${API}/deposit` : ""
  return usePostData(url, data)
}

export const useAddWithdrawBrandPayment = (data) => {
  let url = data ? `${API}/withdraw` : ""
  return usePostData(url, data)
}

export const useUpdateBrandPayment = (id, data) => {
  let url = id && data ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useBrandPaymentHandingFee = (id) => {
  let url = id ? `${API}/${id}/handingFee` : ""
  return useGet(url)
}

export const useUpdateBrandPaymentHandingFee = (id, data) => {
  let url = id ? `${API}/${id}/handingFee` : ""
  return usePutData(url, data)
}

export const useBrandPaymentUpload = (file) => {
  let url = file ? `${API}/upload` : ""
  return usePostFormData(url, file)
}

export const useChangeBrandPaymentOrders = (data) => {
  let url = `${API}/ChangeOrders`
  return usePutData(url, data)
}

export const useChangeBrandPaymentStatus = (id, status) => {
  let url = id && status ? `${API}/${id}/${status}` : ""
  return usePut(url)
}

export const useBrandPaymentLogs = (id) => {
  let url = id ? `${API}/${id}/auditLogs` : ""
  return useGet(url)
}

export const useBrandPaymentDesignatedUsers = (id) => {
  let url = id ? `${API}/${id}/designatedUsers` : ""
  return useGet(url)
}

export const usePlayerDepositPaymentList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/player`) : ""
  return useGet(url)
}

export const useUpdateBrandPaymentExtendeddata = (id, data) => {
  let url = id && data ? `${API}/extendeddata/${id}` : ""
  return usePatchData(url, data)
}

export const usePlatformAutoWithdraw = (id) => {
  let url = id ? `${API}/autowithdraw/${id}` : ""
  return useGet(url)
}

export const useUpdatePlatformAutoWithdraw = (id, data) => {
  let url = id && data ? `${API}/autowithdraw/${id}` : ""
  return usePatchData(url, data)
}
