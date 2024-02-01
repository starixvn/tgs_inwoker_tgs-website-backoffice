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
import { searchPromotionByName } from "./promotion-list-page.js"

const test = base.extend(Fixture)

test("update register reward promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  let [promotion] = await Promise.all([
    backofficeApi.promotion.reward.register.add({
      brandId: platform.id
    }),
    gotoPromotionPage(page, platform.code)
  ])

  //TODO: update from, to
  promotion.subSubject = faker.lorem.word()
  promotion.rule.bonusAmount = promotion.rule.bonusAmount + 1
  promotion.rule.turnoverMultiple = promotion.rule.turnoverMultiple + 1

  await searchPromotionByName(page, promotion.name)

  let DialogSelector = `#edit-promotion-dialog`
  await openDialog(page, DialogSelector)

  await page.fill(
    `${DialogSelector} input[name="subSubject"]`,
    `${promotion.subSubject}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.bonusAmount"]`,
    `${promotion.rule.bonusAmount}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.turnoverMultiple"]`,
    `${promotion.rule.turnoverMultiple}`
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

  expect(mainInfo).not.empty

  expect(content).not.empty
  expect(content.subSubject).equals(promotion.subSubject)

  expect(rule).not.empty
  expect(rule.bonusAmount).equals(promotion.rule.bonusAmount)
  expect(rule.turnoverMultiple).equals(promotion.rule.turnoverMultiple)
})

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
