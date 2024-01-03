import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"

const Api = "/api/notecontbrand"

export const list = async (brandId) => {
  let url = `${host}${Api}/${brandId}/email`
  let response = await fetcher.get(url)
  return await response.json()
}
