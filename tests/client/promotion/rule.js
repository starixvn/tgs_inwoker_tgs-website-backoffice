import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import faker from "@faker-js/faker"
import { findByName } from "./list.js"

const API = "api/promotion/rule"

export const fetch = async ({ promotionId, platformId, name } = {}) => {
  if (!promotionId) {
    let promotion = await findByName(platformId, name)
    if (!promotion) {
      return null
    }

    promotionId = promotion.id
  }

  let url = `${host}/${API}/${promotionId}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result
}

//TODO
export const update = async (promotionId, formData) => {}

export default {
  fetch,
  update
}
