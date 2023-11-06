import { fetcher } from "../../fetcher.js"
import { host } from "../../host.js"
import {
  startOfDay,
  endOfTomorrow,
  formatISO,
  addWeeks,
  format
} from "date-fns"
import mainInfo from "../mainInfo.js"
import content from "../content.js"
import { findByName } from "../list.js"

const API = "api/promotion"

const FirstDeposit = "FirstDeposit"
const DailyFirstDeposit = "DailyFirstDeposit"
const DailySecondDeposit = "DailySecondDeposit"
const DepositReward = "DepositReward"

const ruleBy = (promotionType) => {
  switch (promotionType) {
    case DepositReward:
      return {
        rule: {
          depositMinimumLimit: 10,
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
    let id = promotion?.id

    return {
      ...formData,
      id
    }
  }

export const addFirstDeposit = add(FirstDeposit)

export const PromotionType = {
  firstDeposit: {
    add: add(FirstDeposit)
  },
  dailyFirstDeposit: {
    add: add(DailyFirstDeposit)
  },
  dailySecondDeposit: {
    add: add(DailySecondDeposit)
  },
  depositReward: {
    add: add(DepositReward)
  }
}

export default PromotionType
