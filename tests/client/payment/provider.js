import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const Manual = "Manual"
export const Code = {
  Manual
}

const API = "api/Payment"
export const list = async () => {
  let response = await fetcher.get(`${host}/${API}`)
  let result = await response.json()
  return result?.data
}

export const findByCode = async (value) => {
  let items = await list()
  return items.find((provider) => provider.code === value)
}

export const manual = async () => {
  let result = await findByCode(Manual)
  return result
}

export default {
  list,
  findByCode,
  manual
}
