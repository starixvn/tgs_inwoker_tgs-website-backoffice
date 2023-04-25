import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import faker from "@faker-js/faker"

const Api = "api/promotion"

export const findByName = async (platformId, name) => {
  let url = `${host}/${Api}?brandId=${platformId}&name=${name}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.items?.[0]
}
