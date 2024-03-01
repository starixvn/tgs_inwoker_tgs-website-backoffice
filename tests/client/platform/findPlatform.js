import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { getPlatform } from "./getPlatform.js"

const API = "api/brand"
export const findPlatform = async (value = "") => {
  let url = `${host}/${API}?keyword=${value}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  let filtered = result.items?.find(({ code }) => code === value)

  let platformId = filtered?.id
  if (!platformId) {
    return null
  }

  return getPlatform(platformId)
}
