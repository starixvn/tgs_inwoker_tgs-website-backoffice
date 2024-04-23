import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { getAgent } from "./getAgent.js"

const API = "api/agent"

export const find = async (brandId, username) => {
  let url = `${host}/${API}?username=${username}&brandId=${brandId}&showAll=true`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })
  let result = await response.json()

  let id = result.items[0]?.id
  return getAgent(id)
}

//TODO: rm
export const findAgent = find
