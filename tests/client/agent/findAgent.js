import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/agent"

/*
export const findAgent = async (agentId) => {
  let url = `${host}/${API}/${agentId}`

  let response = await fetcher.get(`${host}/${API}/${agentId}`, {
    failOnStatusCode: true
  })
  let result = await response.json()
  return result.agent
}
*/

export const findAgent = async (brandId, username) => {
  let url = `${host}/${API}?username=${username}&brandId=${brandId}&showAll=true`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })
  let result = await response.json()

  return result.items[0]
}
