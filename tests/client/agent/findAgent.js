import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/agent"

export const findAgent = async (agentId) => {
  let url = `${host}/${API}/${agentId}`

  let response = await fetcher.get(`${host}/${API}/${agentId}`, {
    failOnStatusCode: true
  })
  let result = await response.json()
  return result.agent
}
