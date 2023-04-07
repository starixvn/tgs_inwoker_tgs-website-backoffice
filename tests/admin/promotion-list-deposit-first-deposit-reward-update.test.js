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
import clone from "clone-deep"

const test = base.extend(Fixture)

console.warn("TODO: find out why update first deposit failed?")
test.skip("update first deposit reward promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  await gotoPromotionPage(page, platform.code)

  let promotion = await backofficeApi.promotion.reward.deposit.firstDeposit.add(
    { brandId: platform.id }
  )

  //TODO: also update mainInfo & content
  let expectedRule = clone(promotion.rule)
  expectedRule.percentage = expectedRule.percentage + 1
  expectedRule.bonusAmountLimit = expectedRule.bonusAmountLimit + 1
  expectedRule.turnoverMultiple = expectedRule.turnoverMultiple + 1
  console.log("expectedRule", expectedRule, "promotion.name", promotion.name)

  await searchByName(page, promotion.name)

  let DialogSelector = `#edit-promotion-dialog`
  await openDialog(page, DialogSelector)

  await page.fill(
    `${DialogSelector} input[name="rule.percentage"]`,
    `${expectedRule.percentage}`
  )
  await page.fill(
    `${DialogSelector} input[name="rule.bonusAmountLimit"]`,
    `${expectedRule.bonusAmountLimit}`
  )
  await page.fill(
    `${DialogSelector} input[name="rule.turnoverMultiple"]`,
    `${expectedRule.turnoverMultiple}`
  )

  await Promise.all([
    /*
    TODO: wait for api result?
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/promotion") && response.status() === 200
      )
    }),
    */
    page.waitForTimeout(500),
    page.waitForSelector(DialogSelector, { state: "detached" }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

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

  expect(rule.percentage).equals(expectedRule.percentage)
  expect(rule.bonusAmountLimit).equals(expectedRule.bonusAmountLimit)
  expect(rule.turnoverMultiple).equals(expectedRule.turnoverMultiple)
})

const searchByName = async (page, name) => {
  await page.fill(`input[name="name"]`, name)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`name=${name}`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
