import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { head, random } from "lodash-es"
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
import { searchPromotionByName } from "./promotion-list-page.js"

const test = base.extend(Fixture)

test("view deposit reward v2 promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  let [promotion] = await Promise.all([
    backofficeApi.promotion.reward.deposit.depositRewardV2.add({
      brandId: platform.id
    }),
    gotoPromotionPage(page, platform.code)
  ])

  await searchPromotionByName(page, promotion.name)

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

  let checkedPlayerCondition = head(promotion.rule.playerConditions)
  let isPlayerConditionChecked = await page
    .locator(
      `${DialogSelector} input[type="checkbox"][value="${checkedPlayerCondition}"]`
    )
    .isChecked()
  expect(isPlayerConditionChecked).to.be.true

  let dailyDepositLimitByPlayerString = await page
    .locator(`${DialogSelector} input[name="rule.dailyDepositLimitByPlayer"]`)
    .inputValue()
  let dailyDepositLimitByPlayer = numeral(
    dailyDepositLimitByPlayerString
  ).value()
  expect(dailyDepositLimitByPlayer).equals(
    promotion.rule.dailyDepositLimitByPlayer
  )

  let weeklyDepositLimitByPlayerString = await page
    .locator(`${DialogSelector} input[name="rule.weeklyDepositLimitByPlayer"]`)
    .inputValue()
  let weeklyDepositLimitByPlayer = numeral(
    weeklyDepositLimitByPlayerString
  ).value()
  expect(weeklyDepositLimitByPlayer).equals(
    promotion.rule.weeklyDepositLimitByPlayer
  )

  let monthlyDepositLimitByPlayerString = await page
    .locator(`${DialogSelector} input[name="rule.monthlyDepositLimitByPlayer"]`)
    .inputValue()
  let monthlyDepositLimitByPlayer = numeral(
    monthlyDepositLimitByPlayerString
  ).value()
  expect(monthlyDepositLimitByPlayer).equals(
    promotion.rule.monthlyDepositLimitByPlayer
  )

  let totalDepositLimitByPlayerString = await page
    .locator(`${DialogSelector} input[name="rule.totalDepositLimitByPlayer"]`)
    .inputValue()
  let totalDepositLimitByPlayer = numeral(
    totalDepositLimitByPlayerString
  ).value()
  expect(totalDepositLimitByPlayer).equals(
    promotion.rule.totalDepositLimitByPlayer
  )

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

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
