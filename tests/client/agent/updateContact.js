import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { getAgent } from "./getAgent.js"

const API = "api/agent"

export const updateContact = async (agentId, formData) => {
  let agent = await getAgent(agentId)

  let response = await fetcher.put(`${host}/${API}/${agentId}`, {
    data: { updateType: "contact", ...agent, ...formData },
    failOnStatusCode: true
  })
  let result = await response.json()
  return result
}
