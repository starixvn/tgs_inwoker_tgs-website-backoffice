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
import faker from "@faker-js/faker"

const test = base.extend(Fixture)
const { lorem } = faker

test("add turnover reward promotion", async ({
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
    name: `${lorem.word()}-${Date.now()}`,
    from: format(from, "yyyy/MM/dd"),
    to: format(to, "yyyy/MM/dd"),
    subSubject: lorem.word(),
    totalAmountLimit: 1000,
    percentage: 50,
    bonusAmountLimit: 100,
    turnoverMultiple: 2
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

  const PromotionType = "DailySecondDeposit"
  await page.selectOption(`select[name="promotionType"]`, PromotionType)

  await page.fill(
    `${DialogSelector} input[name="totalAmountLimit"]`,
    `${promotion.totalAmountLimit}`
  )

  await page.fill(
    `${DialogSelector} input[name="subSubject"]`,
    promotion.subSubject
  )

  await page.click(
    `${DialogSelector} #vipLevels input[type="checkbox"] + .bb-CheckboxIcon`
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
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/promotion") && response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  await page.waitForSelector(DialogSelector, { state: "detached" })
  return promotion
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
