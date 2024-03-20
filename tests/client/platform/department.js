import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"

const Api = "/api/department"

export const find = async ({ name = "", brandId = "" }) => {
  let url = `${host}${Api}?showAll=true&name=${name}&brandId=${brandId}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.items
}
