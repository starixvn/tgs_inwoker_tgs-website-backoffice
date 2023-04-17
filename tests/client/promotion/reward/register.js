import { fetcher } from "../../fetcher.js"
import { host } from "../../host.js"
import {
  startOfDay,
  endOfTomorrow,
  formatISO,
  addWeeks,
  format
} from "date-fns"
import faker from "@faker-js/faker"
import mainInfo from "../mainInfo.js"
import content from "../content.js"
import { findByName } from "../list.js"

const API = "api/promotion"

const Register = "Register"

export const rule = ({ ...props } = {}) => {
  return {
    rule: {
      bonusAmount: 10,
      turnoverMultiple: 10,
      ...props
    }
  }
}

export const add = async ({
  promotionType = Register,
  brandId,
  vipLevels = [1],
  ...restFormData
} = {}) => {
  if (!brandId) {
    throw "brandId is required field"
  }

  let formData = {
    promotionType,
    ...mainInfo.random({ promotionType }),
    ...content.random(),
    ...rule(),
    vipLevels,
    brandId,
    ...restFormData
  }

  let response = await fetcher.post(`${host}/${API}`, {
    data: formData,
    failOnStatusCode: true
  })
  let result = await response.json()

  let promotion = await findByName(brandId, formData.name)

  let id = promotion?.id

  return {
    ...formData,
    id
  }
}

export default {
  add
}
