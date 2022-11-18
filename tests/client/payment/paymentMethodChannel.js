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

export default {
  firstBankTransfer
}
