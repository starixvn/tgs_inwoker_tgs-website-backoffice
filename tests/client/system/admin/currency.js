import { fetcher } from "../../fetcher.js"
import { host } from "../../host.js"

const API = "api/currency"

export const find = async (code) => {
  if (!code) {
    return null
  }

  let url = `${host}/${API}?code=${code}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()

  let filtered = result.items?.find((item) => item.code === code)
  return filtered
}
