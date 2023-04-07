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

const TurnoverRebate = "TurnoverRebate"
const TurnoverRebateWeekly = "TurnoverRebateWeekly"
const ruleBy = (promotionType) => {
  switch (promotionType) {
    case TurnoverRebateWeekly:
      return {
        rule: {
          turnoverLimit: 10,
          percentage: 10,
          bonusAmountLimit: 10,
          turnoverMultiple: 10
        }
      }
    default:
      return {
        rule: {
          percentage: 10,
          bonusAmountLimit: 10,
          turnoverMultiple: 10
        }
      }
  }
}

//TODO: move to add.js?
const add =
  (promotionType) =>
  async ({ brandId, vipLevels = [1], ...restFormData } = {}) => {
    if (!brandId) {
      throw "brandId is required field"
    }

    let formData = {
      promotionType,
      ...mainInfo.random({ promotionType }),
      ...content.random(),
      ...ruleBy(promotionType),
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
    console.log("added promotion", promotion)

    let id = promotion?.id

    return {
      ...formData,
      id
    }
  }

export default {
  dailyRebate: {
    add: add(TurnoverRebate)
  },
  weeklyRebate: {
    add: add(TurnoverRebateWeekly)
  }
}
