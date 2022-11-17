import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import faker from "@faker-js/faker"
import { firstBankTransfer } from "../payment/paymentMethodChannel.js"

const API = "api/BrandPayment"

//TODO: merge with withdrawPayment.js?
export const addDeposit = async ({
  brandId,
  channelName = `${faker.lorem.word()}-${Date.now()}`,
  depositedAmountMin = 0,
  depositedAmountMax = 10000,
  depositedAmountUnlimited = true,
  extendedData = {},
  paymentMethodChannelId,
  paymentStatus = "Enabled",
  playerListCondition = "MatchOne",
  transferLimitFrom = 0,
  transferLimitTo = 10000,
  ...data
} = {}) => {
  //TODO: POST with form data
  //TODO: get payment id after create
  if (!brandId) {
    console.error("brandId is required")
    return null
  }
  if (!paymentMethodChannelId) {
    let paymentMethod = await firstBankTransfer()
    if (!paymentMethod) {
      console.error("not able to find a bank transfer payment")
      return null
    }
    paymentMethodChannelId = paymentMethod.id
  }

  let url = `${host}/${API}/deposit`
  let formData = {
    brandId,
    channelName,
    depositedAmountMin,
    depositedAmountMax,
    depositedAmountUnlimited,
    extendedData,
    paymentMethodChannelId,
    paymentStatus,
    playerListCondition,
    transferLimitFrom,
    transferLimitTo,
    ...data
  }

  let response = await fetcher.post(url, { data: formData })
  let result = await response.json()
  if (!result?.valid) {
    console.error("addDeposit failed ", result)
    return null
  }

  let payment = await findByName(brandId, channelName)
  return { ...formData, ...payment }
}

export const listDeposit = async (brandId, keyword = "") => {
  const transferType = "Deposit"
  let url = `${host}/${API}?brandId=${brandId}&transferType=${transferType}&keyword=${keyword}&showAll=true`

  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.items
}

export const findByName = async (brandId, value) => {
  let items = await listDeposit(brandId, value)
  return items?.[0]
}

export const get = async (id) => {
  let url = `${host}/${API}/info/${id}`
  let response = await fetcher.get(url)
  return response.json()
}

export const firstBankManualDepositPayment = async (brandId) => {
  let paymentList = await listDeposit(brandId)

  let bankPaymentList = paymentList.filter(
    ({ bankType, paymentName }) =>
      bankType === "Bank" && paymentName === "Manual"
  )

  let FirstIndex = 0
  let bankPayment = bankPaymentList[FirstIndex]
  return bankPayment
}

export default {
  addDeposit,
  get,
  firstBankManualDepositPayment
}
