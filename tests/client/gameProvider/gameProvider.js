import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { random as randomIndex } from "lodash-es"

const API = "api/GameProvider"

export const list = async () => {
  let url = `${host}/${API}?showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result.items
}

export const random = async () => {
  let items = await list()
  let index = randomIndex(items.length - 1)
  return items?.[index]
}

export const findByCode = async (value) => {
  let url = `${host}/${API}?code=${value}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.items?.[0]
}

export default {
  list,
  random,
  findByCode
}
