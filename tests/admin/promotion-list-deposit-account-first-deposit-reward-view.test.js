import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import numeral from "numeral"
import { fillDatePicker } from "../fill.js"
import { selectPlatformByCode } from "../page/content.js"
import { optionValues } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import clone from "clone-deep"
import { urlIncludes } from "../page/response.js"
import { searchPromotionByName } from "./promotion-list-page.js"

const test = base.extend(Fixture)

test("view account first deposit reward promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  let [promotion] = await Promise.all([
    backofficeApi.promotion.reward.deposit.accountFirstDeposit.add({
      brandId: platform.id
    }),
    gotoPromotionPage(page, platform.code)
  ])

  await searchPromotionByName(page, promotion.name)

  let DialogSelector = `#view-promotion-dialog`
  await openDialog(page, DialogSelector)

  let name = await page
    .locator(`${DialogSelector} input[name="name"]`)
    .inputValue()
  expect(name).equals(promotion.name)

  let subSubject = await page
    .locator(`${DialogSelector} input[name="subSubject"]`)
    .inputValue()
  expect(subSubject).equals(promotion.subSubject)

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
