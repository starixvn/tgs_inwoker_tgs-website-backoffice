import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const EWallet = "E-wallet"
const Pulsa = "Pulsa"

export const Code = {
  EWallet,
  Pulsa
}

const API = "api/PaymentChannel"

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
  return items?.find((item) => item.code === code)
}

export const create = async (code) => {
  let url = `${host}/${API}`
  let response = await fetcher.put(url, {
    headers: {
      "content-type": "application/json"
    },
    data: code,
    failOnStatusCode: true
  })

  if (!response.ok()) {
    console.error("not able to create payment channel ", code)
    return null //or throw err?
  }

  return find(code)
}

export const findOrCreate = async (code) => {
  let item = await find(code)
  if (!item) {
    return create(code)
  }
  return item
}

export const eWallet = async () => findOrCreate(EWallet)

export const pulsa = async () => findOrCreate(Pulsa)

export default {
  list,
  find,
  create,
  findOrCreate,
  eWallet,
  pulsa
}
