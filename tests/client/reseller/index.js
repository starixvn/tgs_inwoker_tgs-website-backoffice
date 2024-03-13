import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/reseller"

export const get = async (id) => {
  let url = `${host}/${API}/${id}`

  let response = await fetcher.get(url)
  let result = await response.json()

  return result.reseller
}

export const find = async (value = "") => {
  let url = `${host}/${API}?keyword=${value}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  let filtered = result.items.find(({ code }) => code === value)

  let id = filtered?.id
  if (!id) {
    return null
  }

  return get(id)
}
