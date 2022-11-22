import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import faker from "@faker-js/faker"

const API = "api/agent/domain"

export const add = async (platformId, agentId, domain = "") => {
  if (!domain) {
    console.error("domain is required")
    return null
  }

  let url = `${host}/${API}/${platformId}/${agentId}?domain=${domain}`
  let response = await fetcher.put(url)
  let status = response.status()
  return status == 200
}

export const list = async (platformId, agentId) => {
  let url = `${host}/${API}/${platformId}/${agentId}`

  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.data
}

export const includes = async (platformId, agentId, domain = "") => {
  let items = await list(platformId, agentId)
  return items?.includes(domain)
}

export const remove = async (platformId, agentId, domain = "") => {
  let url = `${host}/${API}/${platformId}/${agentId}?domain=${domain}`
  let response = await fetcher.delete(url)
  let status = response.status()
  return status == 200
}

export default {
  add,
  list,
  includes,
  remove
}
