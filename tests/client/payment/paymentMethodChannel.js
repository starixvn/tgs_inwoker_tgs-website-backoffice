import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { Code as MethodCode } from "./method.js"

const API = "api/pmc"

export const firstBankTransfer = async () => {
  let response = await fetcher.get(`${host}/${API}`)
  let context = await response.json()
  let { allData = [], methods = [] } = context.data

  let bankTransfer = methods.find(
    (method) => method.code == MethodCode.BankTransfer
  )

  let record = allData.find((item) => {
    return item.methodId === bankTransfer.id
  })
  return record
}

//TODO: return tuple?
const list = async () => {
  let response = await fetcher.get(`${host}/${API}`)
  let result = await response.json()
  return result?.data?.allData
}

export const find = async (paymentId, methodId, channelId) => {
  let items = await list()
  return items?.find(
    (item) =>
      item.paymentId === paymentId &&
      item.methodId === methodId &&
      item.channelId === channelId
  )
}

export const create = async (paymentId, methodId, channelId) => {
  let url = `${host}/${API}`
  let response = await fetcher.post(url, {
    data: { paymentId, methodId, channelId },
    failOnStatusCode: true
  })

  if (!response.ok()) {
    console.error("not able to create payment method channel ")
    return null //or throw err?
  }

  return find(paymentId, methodId, channelId)
}

export const findOrCreate = async (paymentId, methodId, channelId) => {
  let item = await find(paymentId, methodId, channelId)
  if (!item) {
    return create(paymentId, methodId, channelId)
  }
  return item
}

export default {
  firstBankTransfer,
  findOrCreate
}
