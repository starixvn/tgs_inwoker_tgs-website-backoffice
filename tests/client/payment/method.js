import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const BankTransfer = "BankTransfer"
const Crypto = "Crypto"

export const Code = {
  BankTransfer,
  Crypto
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

export const firstBankTransfer = async () => {
  let item = await find(BankTransfer)
  return item
}

export default {
  list,
  find,
  firstBankTransfer
}
