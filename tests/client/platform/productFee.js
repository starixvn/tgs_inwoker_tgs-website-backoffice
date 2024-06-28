import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/BrandProductFee"

export const get = async (brandId) => {
  let response = await fetcher.get(`${host}/${API}/${brandId}`)
  let result = await response.json()
  return result
}

export const set = async (data) => {
  let response = await fetcher.put(`${host}/${API}`, {
    data,
    failOnStatusCode: true
  })
  return response.ok(0)
}
