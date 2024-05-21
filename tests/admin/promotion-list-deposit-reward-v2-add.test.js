import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import {
  startOfDay,
  startOfTomorrow,
  endOfTomorrow,
  format,
  addWeeks
} from "date-fns"
import { fillDatePicker } from "../fill.js"
import { selectPlatformByCode } from "../page/content.js"
import { optionValues } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("add deposit reward v2 promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  await gotoPromotionPage(page, platform.code)

  let promotion = await addPromotion(page)

  let [mainInfo, content, rule] = await Promise.all([
    backofficeApi.promotion.mainInfo.fetch({
      platformId: platform.id,
      name: promotion.name
    }),
    backofficeApi.promotion.content.fetch({
      platformId: platform.id,
      name: promotion.name
    }),
    backofficeApi.promotion.rule.fetch({
      platformId: platform.id,
      name: promotion.name
    })
  ])

  expect(mainInfo).not.empty

  expect(content).not.empty
  expect(promotion.subSubject).equals(content.subSubject)

  expect(rule).not.empty

  promotion.playerConditions.map((playerCondition) => {
    expect(rule.playerConditions).includes(playerCondition)
  })

  expect(promotion.dailyDepositLimitByPlayer).equals(
    rule.dailyDepositLimitByPlayer
  )
  expect(promotion.weeklyDepositLimitByPlayer).equals(
    rule.weeklyDepositLimitByPlayer
  )
  expect(promotion.monthlyDepositLimitByPlayer).equals(
    rule.monthlyDepositLimitByPlayer
  )
  expect(promotion.totalDepositLimitByPlayer).equals(
    rule.totalDepositLimitByPlayer
  )
  expect(promotion.percentage).equals(rule.percentage)
  expect(promotion.bonusAmountLimit).equals(rule.bonusAmountLimit)
  expect(promotion.turnoverMultiple).equals(rule.turnoverMultiple)
})

const addPromotion = async (page) => {
  let DialogSelector = `#add-promotion-dialog`
  await openDialog(page, DialogSelector)

  let from = startOfTomorrow(new Date())
  let to = addWeeks(new Date(), 2)

  let promotion = {
    name: `${faker.lorem.word()}-${Date.now()}`,
    from: format(from, "yyyy/MM/dd"),
    to: format(to, "yyyy/MM/dd"),
    subSubject: faker.lorem.word(),
    dailyDepositLimitByPlayer: 1,
    weeklyDepositLimitByPlayer: 2,
    monthlyDepositLimitByPlayer: 3,
    totalDepositLimitByPlayer: 4,
    percentage: 5,
    bonusAmountLimit: 6,
    turnoverMultiple: 7
  }

  await page.fill(`${DialogSelector} input[name="name"]`, promotion.name)

  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:first-child input`,
    value: promotion.from
  })
  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:not(:first-child) input`,
    value: promotion.to
  })

  const PromotionTypeGroup = "Deposit"
  await page.selectOption(
    `select[name="promotionTypeGroup"]`,
    PromotionTypeGroup
  )

  const PromotionType = "DepositRewardV2"
  await page.selectOption(`select[name="promotionType"]`, PromotionType)

  await page.fill(
    `${DialogSelector} input[name="subSubject"]`,
    promotion.subSubject
  )

  await page.click(
    `${DialogSelector} #vipLevels input[type="checkbox"] + .bb-CheckboxIcon`
  )

  await page.click(`${DialogSelector} [data-type="player-conditions"] button`)

  let playerConditionLocators = await page
    .locator(
      `${DialogSelector} [data-type="player-conditions"] input[type="checkbox"]`
    )
    .all()

  let playerConditions = await playerConditionLocators.reduce(
    async (result, input) => {
      return [...(await result), await input.inputValue()]
    },
    Promise.resolve([])
  )

  Reflect.set(promotion, "playerConditions", playerConditions)

  await page.fill(
    `${DialogSelector} input[name="rule.dailyDepositLimitByPlayer"]`,
    `${promotion.dailyDepositLimitByPlayer}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.weeklyDepositLimitByPlayer"]`,
    `${promotion.weeklyDepositLimitByPlayer}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.monthlyDepositLimitByPlayer"]`,
    `${promotion.monthlyDepositLimitByPlayer}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.totalDepositLimitByPlayer"]`,
    `${promotion.totalDepositLimitByPlayer}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.percentage"]`,
    `${promotion.percentage}`
  )
  await page.fill(
    `${DialogSelector} input[name="rule.bonusAmountLimit"]`,
    `${promotion.bonusAmountLimit}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.turnoverMultiple"]`,
    `${promotion.turnoverMultiple}`
  )

  await Promise.all([
    page.waitForResponse(urlIncludes("/api/promotion")),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  await page.waitForSelector(DialogSelector, { state: "detached" })
  return promotion
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
