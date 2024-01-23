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
import clone from "clone-deep"
import { urlIncludes } from "../page/response.js"
import { searchPromotionByName } from "./promotion-list-page.js"

const test = base.extend(Fixture)

test("update monthly relief money reward promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  let [promotion] = await Promise.all([
    backofficeApi.promotion.reward.reliefMoney.monthlyReliefMoney.add({
      brandId: platform.id
    }),
    gotoPromotionPage(page, platform.code)
  ])

  //TODO: also update mainInfo & content
  let expectedRule = clone(promotion.rule)
  expectedRule.percentage = expectedRule.percentage + 1
  expectedRule.bonusAmountLimit = expectedRule.bonusAmountLimit + 1
  expectedRule.turnoverMultiple = expectedRule.turnoverMultiple + 1

  await searchPromotionByName(page, promotion.name)

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
    page.waitForResponse(urlIncludes(`/api/promotion/main/${promotion.id}`)),
    page.waitForResponse(urlIncludes(`/api/promotion/content/${promotion.id}`)),
    page.waitForResponse(urlIncludes(`/api/promotion/rule/${promotion.id}`)),
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

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
