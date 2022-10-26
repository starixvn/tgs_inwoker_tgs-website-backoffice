import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/GameProviderConfiguration"

export const getConfigs = async (gameProviderId = "") => {
  let url = `${host}/${API}?gameProviderId=${gameProviderId}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result.items
}
