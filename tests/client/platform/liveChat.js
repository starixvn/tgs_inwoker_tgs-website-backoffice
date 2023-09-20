import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"

const API = "api/BrandLiveChat"

export const add = async ({
  brandId,
  name = `${faker.person.firstName()}-${Date.now()}`,
  setting = JSON.stringify({
    a: faker.number.int(100)
  })
}) => {
  let data = {
    brandId,
    name,
    setting
  }

  let response = await fetcher.post(`${host}/${API}`, {
    data
    /*
    failOnStatusCode: true
    */
  })

  let result = await response.json()
  if (!result.valid || !response.ok()) {
    console.error("add live chat failed", result)
    throw result
  }

  return data
}

export const get = async (brandId) => {
  if (!brandId) {
    console.error("brandId is required for get live chat record")
    return null
  }

  let response = await fetcher.get(`${host}/${API}/${brandId}`)
  let content = await response.json()
  return content?.data
}

export const deleteByPlatformId = async (platformId) => {
  if (!platformId) {
    console.error(`delete live chat by platform id ${platformId} failed`)
    return null
  }

  let response = await fetcher.delete(`${host}/${API}/${platformId}`)

  let result = await response.json()
  if (!result.valid || !response.ok()) {
    console.error("delete live chat failed", result)
    throw result
  }

  return result
}

export default {
  add,
  get,
  deleteByPlatformId,
  delete: deleteByPlatformId
}
