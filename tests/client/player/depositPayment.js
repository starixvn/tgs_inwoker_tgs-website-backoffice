import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { random } from "lodash-es"

const API = "api/brandpayment"

export const depositPaymentList = async (brandId, playerCode) => {
  let url = `${host}/${API}/player?brandId=${brandId}&playerCode=${playerCode}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result
}

export const firstBankDepositPayment = async (brandId, playerCode) => {
  let paymentList = await depositPaymentList(brandId, playerCode)

  let bankPaymentList = paymentList.filter(
    ({ banktype, extended }) => banktype === "Bank" && extended.bankAccount
  )
  let FirstIndex = 0

  let bankPayment = bankPaymentList[FirstIndex]
  return bankPayment
}
