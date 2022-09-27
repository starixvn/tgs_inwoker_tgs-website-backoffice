import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/agent"

export const getAgent = async (agentId) => {
  let response = await fetcher.get(`${host}/${API}/${agentId}`, {
    failOnStatusCode: true
  })
  return await response.json()
}
