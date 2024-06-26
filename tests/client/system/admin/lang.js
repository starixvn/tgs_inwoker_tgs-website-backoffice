import { fetcher } from "../../fetcher.js"
import { host } from "../../host.js"

const API = "api/language"

export const find = async (cultureCode) => {
  if (!cultureCode) {
    return null
  }

  let url = `${host}/${API}?cultureCode=${cultureCode}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()

  let filtered = result.items?.find((item) => item.cultureCode === cultureCode)
  return filtered
}
