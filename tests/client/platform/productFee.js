import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/BrandProductFee"

export const get = async (brandId) => {
  let response = await fetcher.get(`${host}/${API}/${brandId}`)
  let result = await response.json()
  return result
}
