import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import faker from "@faker-js/faker"

const API = "api/BrandMaintenance"

export const getMessage = async (platformMaintenanceId) => {
  let response = await fetcher.get(`${API}/${platformMaintenanceId}`)
  let record = await response.json()
  return record?.content
}

export const updateMessage = async (platformMaintenanceId, content = "") => {
  let response = await fetcher.put(`${API}/content/${platformMaintenanceId}`, {
    data: {
      content
    }
  })

  let result = await response.json()
  if (!result.valid || !response.ok()) {
    console.error("add maintenance message failed", result)
    throw result
  }

  return result
}

export const listAll = async () => {
  let response = await fetcher.get(`${host}/${API}`)
  return await response.json()
}

export const findByPlatformCode = async (platformCode) => {
  let items = await listAll()

  let item = items.find(({ brandCode }) => brandCode === platformCode)
  return item
}
