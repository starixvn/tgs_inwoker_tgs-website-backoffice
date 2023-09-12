import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"
import { findByName } from "./list.js"
import { addWeeks, format } from "date-fns"

const BaseApi = "api/promotion"
const API = `${BaseApi}/main`

const MinTotalAmountLimit = 1000000
const MaxTotalAmountLimit = MinTotalAmountLimit + 1000

export const random = ({
  promotionType = "",
  name,
  from = format(addWeeks(new Date(), 1), "yyyy-MM-dd"),
  to = format(addWeeks(new Date(), 2), "yyyy-MM-dd"),
  autoSentPlayerBonus = true,
  unlimited = true,
  totalAmountLimit = faker.number.int({
    min: MinTotalAmountLimit,
    max: MaxTotalAmountLimit
  }),
  ...props
} = {}) => {
  name = name ?? `${faker.lorem.word()}-${Date.now()}-${promotionType}`

  return {
    promotionType,
    name,
    from,
    to,
    autoSentPlayerBonus,
    totalAmountLimit,
    unlimited,
    ...props
  }
}

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
  random,
  fetch,
  update
}
