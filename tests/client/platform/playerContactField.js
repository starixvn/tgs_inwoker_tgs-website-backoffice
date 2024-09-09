import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"

const Api = "/api/brand/player-contract"

export const list = async (brandId) => {
  let url = `${host}${Api}/${brandId}/display`
  let response = await fetcher.get(url)
  return await response.json()
}

export const has = async (brandId, field = "") => {
  let setting = await list(brandId)
  let result = setting.find(({ name }) => name === field)
  return result?.isVisualized ?? false
}
