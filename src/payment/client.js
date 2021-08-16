import { urlWith, useGet, usePostData, usePutData, useDelete } from "../client"

let API = "/api/Payment"

let CodeTranPairs = [
  [
    "Manual",
    {
      zh: "手动支付",
      en: "Manual Payment"
    }
  ]
]

export const usePaymentList = () => {
  let { data, ...rest } = useGet(API)

  let items = []
  if (data?.data?.length > 0) {
    items = data?.data?.map((item) => {
      let [code, trans] =
        CodeTranPairs.find(([code, trans]) => code === item.code) ?? []

      return {
        ...item,
        trans: trans
      }
    })
  }

  return {
    data: items,
    ...rest
  }
}

export const useAddPayment = (data) => {
  let url = data ? `/api/payment` : ""
  return usePutData(url, data)
}

let PAYMENT_CHANNEL_API = "/api/PaymentChannel"
export const usePaymentChannelList = () => {
  let { data, ...rest } = useGet(PAYMENT_CHANNEL_API)
  return {
    data: data?.data,
    ...rest
  }
}

export const useAddPaymentChannel = (data) => {
  let url = data ? `${PAYMENT_CHANNEL_API}` : ""
  return usePutData(url, data)
}

let PAYMENT_METHOD_API = "/api/PaymentMethod"
export const usePaymentMethodList = () => {
  let { data, ...rest } = useGet(PAYMENT_METHOD_API)
  return {
    data: data?.data,
    ...rest
  }
}

export const useAddPaymentMethod = (data) => {
  let url = data ? `${PAYMENT_METHOD_API}` : ""
  return usePutData(url, data)
}

export const usePaymentMethodChannelList = () => {
  let { data, ...rest } = useGet(`/api/pmc`)

  return {
    data: data?.data,
    ...rest
  }
}

export const useAddPaymentMethodChannel = (data) => {
  let url = data ? `/api/pmc` : ""
  return usePostData(url, data)
}

export const useDeletePaymentMethodChannel = (id) => {
  let url = id ? `/api/pmc/${id}` : ""
  return useDelete(url)
}
