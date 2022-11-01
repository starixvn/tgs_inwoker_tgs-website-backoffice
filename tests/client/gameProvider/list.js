import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/GameProvider"

export const list = async () => {
  let url = `${host}/${API}?showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result.items
}
