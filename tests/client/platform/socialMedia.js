import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"

const Api = "/api/brand/social"

export const list = async (brandId) => {
  let url = `${host}${Api}/${brandId}`
  let response = await fetcher.get(url)
  return response.json()
}

export const deleteById = async (brandId, socialMediaId) => {
  let url = `${host}${Api}/${brandId}/${socialMediaId}`
  let response = await fetcher.delete(url)
  return response.ok()
}
