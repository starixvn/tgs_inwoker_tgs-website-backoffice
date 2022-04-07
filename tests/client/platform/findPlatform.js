import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/brand"
export const findPlatform = async (value = "") => {
  let url = `${host}/${API}?keyword=${value}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()

  return result.items[0]
}
