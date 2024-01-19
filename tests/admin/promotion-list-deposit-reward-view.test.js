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
import { openDialog } from "../page/dialog.js"
import clone from "clone-deep"
import numeral from "numeral"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("view deposit reward promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  let [promotion] = await Promise.all([
    backofficeApi.promotion.reward.deposit.depositReward.add({
      brandId: platform.id
    }),
    gotoPromotionPage(page, platform.code)
  ])

  await searchByName(page, promotion.name)

  let DialogSelector = `#view-promotion-dialog`
  await openDialog(page, DialogSelector)

  let promotionType = await page
    .locator(`${DialogSelector} select[name="promotionType"]`)
    .inputValue()
  expect(promotionType).equals(promotion.promotionType)

  let name = await page
    .locator(`${DialogSelector} input[name="name"]`)
    .inputValue()
  expect(name).equals(promotion.name)

  let subSubject = await page
    .locator(`${DialogSelector} input[name="subSubject"]`)
    .inputValue()
  expect(subSubject).equals(promotion.subSubject)

  let depositMinimumLimitString = await page
    .locator(`${DialogSelector} input[name="rule.depositMinimumLimit"]`)
    .inputValue()

  let depositMinimumLimit = numeral(depositMinimumLimitString).value()
  expect(depositMinimumLimit).equals(promotion.rule.depositMinimumLimit)

  let percentageString = await page
    .locator(`${DialogSelector} input[name="rule.percentage"]`)
    .inputValue()
  let percentage = numeral(percentageString).value()
  expect(percentage).equals(promotion.rule.percentage)

  let bonusAmountLimitString = await page
    .locator(`${DialogSelector} input[name="rule.bonusAmountLimit"]`)
    .inputValue()
  let bonusAmountLimit = numeral(bonusAmountLimitString).value()
  expect(bonusAmountLimit).equals(promotion.rule.bonusAmountLimit)

  let turnoverMultipleString = await page
    .locator(`${DialogSelector} input[name="rule.turnoverMultiple"]`)
    .inputValue()
  let turnoverMultiple = numeral(turnoverMultipleString).value()
  expect(turnoverMultiple).equals(promotion.rule.turnoverMultiple)
})

const searchByName = async (page, name) => {
  await page.fill(`input[name="name"]`, name)
  await Promise.all([
    page.waitForResponse(urlIncludes(`name=${name}`)),
    page.click(`button[type="submit"]`)
  ])
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
