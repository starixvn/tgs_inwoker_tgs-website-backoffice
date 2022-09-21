import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { firstBankDepositPayment } from "./depositPayment.js"
import faker from "@faker-js/faker"

const { finance } = faker

const API = "api/ManualDeposit"
export const applyBankManualDepositForm = async ({
  bankType = "Bank",
  brandId,
  playerCode,
  brandPaymentId,
  bankName = "abc",
  bankAccount = finance.account(),
  ...formData
} = {}) => {
  let brandPayment = await firstBankDepositPayment(brandId, playerCode)
  brandPaymentId = brandPaymentId ?? brandPayment?.id
  if (!brandPaymentId) {
    throw "brandPaymentId is required, brandPayment not found"
  }

  let response = await fetcher.put(`${host}/${API}/Bank`, {
    data: {
      bankType,
      brandId,
      playerCode,
      brandPaymentId,
      bankName,
      bankAccount,
      ...formData
    },
    failOnStatusCode: true
  })

  let result = await response.json()
  return result
}
