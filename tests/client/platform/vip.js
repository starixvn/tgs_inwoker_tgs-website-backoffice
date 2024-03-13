import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/vipLevel"

export const list = async (brandId) => {
  let url = `${host}/${API}?brandId=${brandId}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.items
}

export const add = async (formData) => {
  let url = `${host}/${API}`
  let response = await fetcher.post(url, { data: formData })
  let result = await response.json()
  return result
}
