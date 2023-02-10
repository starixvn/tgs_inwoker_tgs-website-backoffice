import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const BankTransfer = "BankTransfer"
const Crypto = "Crypto"
const EWallet = "EWallet"
const Pulsa = "Pulsa"

export const Code = {
  BankTransfer,
  Crypto,
  EWallet,
  Pulsa
}

const API = "api/PaymentMethod"

export const list = async () => {
  let url = `${host}/${API}`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })

  let result = await response.json()
  return result.data
}

export const find = async (code) => {
  let items = await list()
  return items?.find((method) => method.code === code)
}

export const create = async (code, bankType) => {
  let url = `${host}/${API}`
  let response = await fetcher.put(url, {
    data: { code, bankType },
    failOnStatusCode: true
  })

  if (!response.ok()) {
    console.error("not able to create payment method ", code)
    return null //or throw err?
  }

  return find(code)
}

export const findOrCreate = async (code, bankType) => {
  let item = await find(code)
  if (!item) {
    return create(code, bankType)
  }
  return item
}

export const eWallet = async () => findOrCreate(EWallet, EWallet)

export const pulsa = async () => findOrCreate(Pulsa, Pulsa)

export const bankTransfer = async () => {
  let item = await find(BankTransfer)
  return item
}

export default {
  list,
  find,
  create,
  findOrCreate,
  bankTransfer,
  eWallet,
  pulsa
}
