import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/brand"

export const getPlatform = async (id = "") => {
  let url = `${host}/${API}/${id}`

  let response = await fetcher.get(url)
  let result = await response.json()

  return result.brand
}
