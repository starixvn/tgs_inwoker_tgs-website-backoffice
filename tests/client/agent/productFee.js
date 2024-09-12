import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/AgentProductFee"

export const get = async (agentId) => {
  let url = `${host}/${API}/${agentId}`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })
  let result = await response.json()
  return result
}
