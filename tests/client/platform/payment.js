import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import faker from "@faker-js/faker"
import { firstBankTransfer } from "../payment/paymentMethodChannel.js"

const API = "api/BrandPayment"

//TODO
const Deposit = "Deposit"
const Withdraw = "Withdraw"

export const Type = {
  Deposit,
  Withdraw
}

const Withdrawal = "Withdrawal"

export const TransferType = {
  Deposit,
  Withdrawal
}

export const list = async ({
  brandId,
  transferType = TransferType.Deposit
}) => {
  let url = `${host}/${API}?brandId=${brandId}&transferType=${transferType}&showAll=true`

  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.items
}

export const find = async ({
  brandId,
  transferType,
  paymentMethodChannelId = ""
}) => {
  let items = await list({ brandId, transferType })
  return items?.find(
    (item) => item.paymentMethodChannelId === paymentMethodChannelId
  )
}

const typeOf = (transferType) => {
  switch (transferType) {
    case TransferType.Deposit:
      return Type.Deposit
    case TransferType.Withdrawal:
      return Type.Withdraw
    default:
      return null
  }
}

export const create = async ({
  brandId,
  transferType,
  paymentMethodChannelId,
  extendedData = {},
  channelName = `${faker.lorem.word()}-${Date.now()}`,
  depositedAmountMin = 0,
  depositedAmountMax = 10000,
  depositedAmountUnlimited = true,
  transferLimitFrom = 0,
  transferLimitTo = 10000,
  paymentStatus = "Enabled",
  playerListCondition = "MatchOne",
  allPlayers = true,
  ...data
}) => {
  if (!brandId) {
    console.error("brandId is required")
    return null
  }
  if (!transferType) {
    console.error("type is required")
    return null
  }
  if (!paymentMethodChannelId) {
    console.error("paymentMethodChannelId is required")
    return null
  }

  let url = `${host}/${API}/${typeOf(transferType)}`
  let formData = {
    brandId,
    paymentMethodChannelId,
    extendedData,
    channelName,
    depositedAmountMin,
    depositedAmountMax,
    depositedAmountUnlimited,
    transferLimitFrom,
    transferLimitTo,
    paymentStatus,
    playerListCondition,
    allPlayers,
    ...data
  }

  let response = await fetcher.post(url, { data: formData })
  let result = await response.json()
  if (!result?.valid) {
    console.error("create payment failed ", result)
    return null
  }

  let payment = await find({ brandId, transferType, paymentMethodChannelId })
  return { ...formData, ...payment }
}

export const findOrCreate = async (props) => {
  let item = await find(props)
  if (!item) {
    return create(props)
  }
  return item
}

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

//TODO:
//1. find payment base on paymentMethodChannelId
//2. findOrCreate base on paymentMethodChannelId
//3.
export const withdraw = {}

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
  Type,
  TransferType,
  create,
  findOrCreate,
  addDeposit,
  get,
  firstBankManualDepositPayment
}
