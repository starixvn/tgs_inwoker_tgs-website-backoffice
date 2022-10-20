import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { getPlatform } from "./getPlatform.js"

const API = "api/brand"

export const updatePlatform = async (platformId, formData) => {
  let platform = await getPlatform(platformId)
  let data = { ...platform, ...formData }

  let url = `${host}/${API}/${platformId}`

  let response = await fetcher.put(url, {
    data,
    failOnStatusCode: true
  })
  let result = await response.json()

  return result?.brand
}
