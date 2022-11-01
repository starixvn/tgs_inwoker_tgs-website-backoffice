import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { random } from "lodash-es"

const API = "api/brandpayment"

export const withdrawPaymentList = async (
  brandId,
  transferType = "Withdrawal"
) => {
  let url = `${host}/${API}?brandId=${brandId}&transferType=${transferType}&showAll=true`

  let response = await fetcher.get(url)
  let result = await response.json()

  return result?.items
}

export const firstBankManualWithdrawPayment = async (brandId) => {
  if (!brandId) {
    console.error("brandId is required")
    return null
  }
  let paymentList = await withdrawPaymentList(brandId)

  let bankPaymentList = paymentList.filter(
    ({ bankType, paymentName }) =>
      bankType === "Bank" && paymentName === "Manual"
  )
  let FirstIndex = 0

  let bankPayment = bankPaymentList[FirstIndex]
  return bankPayment
}
